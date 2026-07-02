-- =============================================================
-- Helper functions
-- =============================================================

-- current user's role, used everywhere in RLS policies
create or replace function public.current_role()
returns user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((select role in ('editor','admin') from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

-- updated_at bookkeeping
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.news_posts
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- =============================================================
-- New user bootstrap: create profile row, generate membership number,
-- and promote the configured bootstrap admin email automatically.
-- ADMIN_BOOTSTRAP_EMAIL is stored in site_settings so it can be changed
-- without a redeploy (seeded from env var on first migration, see seed.sql).
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  bootstrap_email text;
  assigned_role user_role := 'visitor';
begin
  select value ->> 'email' into bootstrap_email
  from public.site_settings where key = 'admin_bootstrap_email';

  if bootstrap_email is not null and lower(new.email) = lower(bootstrap_email) then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, display_name, avatar_url, role, membership_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    assigned_role,
    'VU-' || to_char(now(), 'YYYY') || '-' || upper(substr(new.id::text, 1, 6))
  );

  if assigned_role = 'admin' then
    insert into public.audit_log (actor_id, action, target_table, target_id, metadata)
    values (new.id, 'admin_bootstrap_promotion', 'profiles', new.id::text, jsonb_build_object('email', new.email));
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Role changes: only admins may promote/demote, and every change is logged.
-- =============================================================
create or replace function public.log_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    insert into public.audit_log (actor_id, action, target_table, target_id, metadata)
    values (auth.uid(), 'role_change', 'profiles', new.id::text,
            jsonb_build_object('from', old.role, 'to', new.role));
  end if;
  return new;
end;
$$;

create trigger on_profile_role_change
  before update of role on public.profiles
  for each row execute function public.log_role_change();

-- =============================================================
-- Waitlist promotion: if a 'going' RSVP is cancelled, bump the oldest
-- waitlisted RSVP to 'going' automatically.
-- =============================================================
create or replace function public.promote_waitlist()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.status = 'going' and new.status = 'cancelled' then
    update public.event_rsvps
    set status = 'going'
    where id = (
      select id from public.event_rsvps
      where event_id = old.event_id and status = 'waitlisted'
      order by created_at asc
      limit 1
    );
  end if;
  return new;
end;
$$;

create trigger on_rsvp_cancelled
  after update of status on public.event_rsvps
  for each row execute function public.promote_waitlist();

-- =============================================================
-- Capacity-aware RSVP: auto-waitlist when event is full
-- =============================================================
create or replace function public.rsvp_with_capacity(p_event_id uuid, p_guests int default 0)
returns rsvp_status
language plpgsql security definer set search_path = public as $$
declare
  v_capacity int;
  v_going_count int;
  v_status rsvp_status;
begin
  select max_capacity into v_capacity from public.events where id = p_event_id;

  if v_capacity is null then
    v_status := 'going';
  else
    select coalesce(sum(1 + guests), 0) into v_going_count
    from public.event_rsvps where event_id = p_event_id and status = 'going';

    if v_going_count + 1 + p_guests <= v_capacity then
      v_status := 'going';
    else
      v_status := 'waitlisted';
    end if;
  end if;

  insert into public.event_rsvps (event_id, user_id, status, guests)
  values (p_event_id, auth.uid(), v_status, p_guests)
  on conflict (event_id, user_id)
  do update set status = excluded.status, guests = excluded.guests, created_at = now();

  return v_status;
end;
$$;

-- =============================================================
-- Volunteer gamification: award points when a signup is approved
-- =============================================================
create or replace function public.award_volunteer_points()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.approved = true and old.approved = false then
    update public.profiles
    set volunteer_points = volunteer_points + greatest(coalesce(new.hours, 1)::int * 10, 10)
    where id = new.user_id;
  end if;
  return new;
end;
$$;

create trigger on_volunteer_approved
  after update of approved on public.volunteer_signups
  for each row execute function public.award_volunteer_points();

-- =============================================================
-- Full-text search across news + events (used by global search)
-- =============================================================
create or replace function public.global_search(q text)
returns table (
  kind text,
  id uuid,
  title text,
  excerpt text,
  url_path text,
  rank real
)
language sql stable security definer set search_path = public as $$
  select * from (
    select 'news' as kind, id, title, excerpt, '/nyheter/' || slug as url_path,
           ts_rank(to_tsvector('swedish', title || ' ' || coalesce(excerpt,'')), plainto_tsquery('swedish', q)) as rank
    from public.news_posts
    where status = 'published'
      and to_tsvector('swedish', title || ' ' || coalesce(excerpt,'') || ' ' || content) @@ plainto_tsquery('swedish', q)
    union all
    select 'event' as kind, id, title, description as excerpt, '/event/' || slug as url_path,
           ts_rank(to_tsvector('swedish', title || ' ' || description), plainto_tsquery('swedish', q)) as rank
    from public.events
    where is_published = true
      and to_tsvector('swedish', title || ' ' || description) @@ plainto_tsquery('swedish', q)
  ) combined
  order by rank desc
  limit 20;
$$;