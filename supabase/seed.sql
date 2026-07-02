-- =============================================================
-- Seed data. Safe to run multiple times (idempotent upserts).
-- The admin bootstrap email is read from an env var at migration
-- time via the Supabase CLI `--env` substitution in CI, falling
-- back to the literal default below for local dev.
-- =============================================================

insert into public.site_settings (key, value)
values (
  'admin_bootstrap_email',
  jsonb_build_object('email', coalesce(current_setting('app.admin_bootstrap_email', true), 'richard.x.bostrom@gmail.com'))
)
on conflict (key) do update set value = excluded.value;

insert into public.site_settings (key, value) values
  ('site_name', '"Verket Umeå"'),
  -- The current site lists no fixed opening hours — Verket opens around
  -- scheduled events rather than daily hours. Replace this placeholder
  -- once the board decides whether to publish regular hours.
  ('opening_hours', '{"mon":"Se kalendern","tue":"Se kalendern","wed":"Se kalendern","thu":"Se kalendern","fri":"Se kalendern","sat":"Se kalendern","sun":"Se kalendern"}'),
  -- Real social links are not published on the current site — fill these
  -- in with the association's actual accounts before launch, or remove
  -- the ones that don't exist. Leaving a fake handle live is worse than
  -- leaving it blank.
  ('social_links', '{"instagram":"","discord":"","facebook":"","youtube":""}'),
  ('contact_email', '"verketforening@gmail.com"'),
  ('address', '"Götgatan 2, 903 27 Umeå"'),
  ('membership_fee_sek', '50'),
  ('swish_number', '"123-166 59 42"'),
  ('plusgiro_number', '"920287-0 (Nordea)"')
on conflict (key) do update set value = excluded.value;

insert into public.news_categories (name, slug) values
  ('Nyheter', 'nyheter'),
  ('Evenemang', 'evenemang'),
  ('Community', 'community'),
  ('Pressmeddelande', 'press')
on conflict (slug) do nothing;

insert into public.board_categories (name, slug, description) values
  ('Allmänt', 'allmant', 'Prata om vad som helst kopplat till Verket'),
  ('Musik', 'musik', 'Band, spellistor, gear'),
  ('Gaming', 'gaming', 'LAN, turneringar, retro'),
  ('Volontär', 'volontar', 'Koordinering för volontärer')
on conflict (slug) do nothing;

-- NOTE: richard.x.bostrom@gmail.com becomes admin automatically the
-- first time that email signs in (see handle_new_user() trigger),
-- because it matches the admin_bootstrap_email setting above.
