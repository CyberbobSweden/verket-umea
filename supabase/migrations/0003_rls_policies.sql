-- =============================================================
-- Row Level Security — deny by default, grant explicitly.
-- =============================================================
alter table public.profiles enable row level security;
alter table public.news_categories enable row level security;
alter table public.news_posts enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_media enable row level security;
alter table public.comments enable row level security;
alter table public.board_categories enable row level security;
alter table public.board_threads enable row level security;
alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;
alter table public.suggestions enable row level security;
alter table public.messages enable row level security;
alter table public.volunteer_signups enable row level security;
alter table public.sponsors enable row level security;
alter table public.documents enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_log enable row level security;
alter table public.contact_messages enable row level security;

-- ---------- PROFILES ----------
create policy "profiles are publicly readable" on public.profiles
  for select using (true);

create policy "users update own profile, cannot change role" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "admins manage all profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- NEWS ----------
create policy "published news is public" on public.news_posts
  for select using (status = 'published' or public.is_staff() or author_id = auth.uid());

create policy "staff manage news" on public.news_posts
  for insert with check (public.is_staff());
create policy "staff update news" on public.news_posts
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete news" on public.news_posts
  for delete using (public.is_staff());

create policy "news categories public read" on public.news_categories for select using (true);
create policy "staff manage categories" on public.news_categories for all using (public.is_staff()) with check (public.is_staff());

-- ---------- EVENTS ----------
create policy "published events are public" on public.events
  for select using (is_published = true or public.is_staff());
create policy "staff manage events" on public.events
  for insert with check (public.is_staff());
create policy "staff update events" on public.events
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete events" on public.events
  for delete using (public.is_staff());

-- ---------- RSVPs ----------
create policy "users see own rsvps, staff see all" on public.event_rsvps
  for select using (auth.uid() = user_id or public.is_staff());
create policy "members create own rsvp" on public.event_rsvps
  for insert with check (auth.uid() = user_id);
create policy "members update own rsvp" on public.event_rsvps
  for update using (auth.uid() = user_id or public.is_staff());
create policy "members cancel own rsvp" on public.event_rsvps
  for delete using (auth.uid() = user_id or public.is_staff());

-- ---------- GALLERY ----------
create policy "published albums are public" on public.gallery_albums
  for select using (is_published = true or public.is_staff());
create policy "staff manage albums" on public.gallery_albums
  for all using (public.is_staff()) with check (public.is_staff());

create policy "media visible with album" on public.gallery_media
  for select using (
    exists (select 1 from public.gallery_albums a where a.id = album_id and (a.is_published or public.is_staff()))
  );
create policy "staff manage media" on public.gallery_media
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- COMMENTS ----------
create policy "visible comments are public" on public.comments
  for select using (is_hidden = false or public.is_staff() or author_id = auth.uid());
create policy "authenticated users comment" on public.comments
  for insert with check (auth.uid() = author_id);
create policy "authors edit own comment, staff moderate" on public.comments
  for update using (auth.uid() = author_id or public.is_staff());
create policy "authors delete own comment, staff moderate" on public.comments
  for delete using (auth.uid() = author_id or public.is_staff());

-- ---------- COMMUNITY BOARD ----------
create policy "board categories public read" on public.board_categories for select using (true);
create policy "staff manage board categories" on public.board_categories for all using (public.is_staff()) with check (public.is_staff());

create policy "threads are public read" on public.board_threads for select using (true);
create policy "members create threads" on public.board_threads
  for insert with check (
    auth.uid() = author_id and
    (select role from public.profiles where id = auth.uid()) in ('member','volunteer','editor','admin')
  );
create policy "authors and staff update threads" on public.board_threads
  for update using (auth.uid() = author_id or public.is_staff());
create policy "authors and staff delete threads" on public.board_threads
  for delete using (auth.uid() = author_id or public.is_staff());

-- ---------- POLLS ----------
create policy "polls are public read" on public.polls for select using (true);
create policy "staff manage polls" on public.polls for insert with check (public.is_staff());
create policy "staff update polls" on public.polls for update using (public.is_staff());

create policy "users see own votes" on public.poll_votes for select using (auth.uid() = user_id or public.is_staff());
create policy "authenticated users vote once" on public.poll_votes
  for insert with check (auth.uid() = user_id);

-- ---------- SUGGESTIONS ----------
create policy "suggestions are public read" on public.suggestions for select using (true);
create policy "members create suggestions" on public.suggestions
  for insert with check (auth.uid() = author_id);
create policy "authors and staff update suggestions" on public.suggestions
  for update using (auth.uid() = author_id or public.is_staff());

-- ---------- PRIVATE MESSAGES ----------
create policy "users see own conversations" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "users send messages as themselves" on public.messages
  for insert with check (auth.uid() = sender_id);
create policy "recipients mark read" on public.messages
  for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

-- ---------- VOLUNTEER SIGNUPS ----------
create policy "users see own signups, staff see all" on public.volunteer_signups
  for select using (auth.uid() = user_id or public.is_staff());
create policy "members create signups" on public.volunteer_signups
  for insert with check (auth.uid() = user_id);
create policy "staff approve signups" on public.volunteer_signups
  for update using (public.is_staff()) with check (public.is_staff());

-- ---------- SPONSORS / DOCUMENTS / NEWSLETTER ----------
create policy "sponsors are public read" on public.sponsors for select using (true);
create policy "staff manage sponsors" on public.sponsors for all using (public.is_staff()) with check (public.is_staff());

create policy "public documents are readable, members see member docs" on public.documents
  for select using (is_public = true or public.is_staff() or
    (select role from public.profiles where id = auth.uid()) in ('member','volunteer','editor','admin'));
create policy "staff manage documents" on public.documents for all using (public.is_staff()) with check (public.is_staff());

create policy "anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "staff read subscribers" on public.newsletter_subscribers for select using (public.is_staff());

-- ---------- SITE SETTINGS ----------
create policy "settings are publicly readable" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- ---------- AUDIT LOG ----------
create policy "admins read audit log" on public.audit_log for select using (public.is_admin());
-- inserts happen only via security-definer trigger functions above.

-- ---------- CONTACT ----------
create policy "anyone can send a contact message" on public.contact_messages for insert with check (true);
create policy "staff read contact messages" on public.contact_messages for select using (public.is_staff());
create policy "staff update contact messages" on public.contact_messages for update using (public.is_staff());
