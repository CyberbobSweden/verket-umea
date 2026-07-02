-- =============================================================
-- Verket Umeå — Core schema
-- =============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type user_role as enum ('visitor', 'member', 'volunteer', 'editor', 'admin');
create type membership_status as enum ('none', 'pending', 'active', 'expired', 'cancelled');
create type event_category as enum ('konsert', 'gaming', 'workshop', 'community', 'metal', 'club', 'ovrigt');
create type rsvp_status as enum ('going', 'waitlisted', 'cancelled');
create type news_status as enum ('draft', 'published', 'archived');
create type poll_status as enum ('open', 'closed');

-- =============================================================
-- PROFILES  (1:1 with auth.users)
-- =============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Ny medlem',
  username text unique,
  avatar_url text,
  bio text,
  role user_role not null default 'visitor',
  membership_status membership_status not null default 'none',
  membership_number text unique,
  membership_expires_at date,
  volunteer_points int not null default 0,
  phone text,
  notify_email boolean not null default true,
  notify_push boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Public profile + role/membership data, 1:1 with auth.users';

-- =============================================================
-- NEWS
-- =============================================================
create table public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  status news_status not null default 'draft',
  pinned boolean not null default false,
  category_id uuid references public.news_categories(id) on delete set null,
  tags text[] not null default '{}',
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index news_posts_status_idx on public.news_posts (status, published_at desc);
create index news_posts_tags_idx on public.news_posts using gin (tags);
create index news_posts_search_idx on public.news_posts using gin (
  to_tsvector('swedish', coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(content,''))
);

-- =============================================================
-- EVENTS
-- =============================================================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  cover_image_url text,
  category event_category not null default 'ovrigt',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location_name text not null default 'Verket Umeå',
  location_address text,
  location_lat double precision,
  location_lng double precision,
  max_capacity int,
  price_sek numeric(10,2) default 0,
  external_ticket_url text,
  google_calendar_id text,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_time_check check (ends_at > starts_at)
);
create index events_starts_at_idx on public.events (starts_at);
create index events_category_idx on public.events (category);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status rsvp_status not null default 'going',
  guests int not null default 0,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index event_rsvps_event_idx on public.event_rsvps (event_id, status);

-- =============================================================
-- GALLERY
-- =============================================================
create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  cover_image_url text,
  event_id uuid references public.events(id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  media_type text not null default 'image' check (media_type in ('image','video')),
  storage_path text not null,
  thumbnail_path text,
  width int,
  height int,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index gallery_media_album_idx on public.gallery_media (album_id, sort_order);

-- =============================================================
-- COMMENTS  (polymorphic: news posts, gallery albums, board threads)
-- =============================================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  parent_type text not null check (parent_type in ('news', 'gallery_album', 'board_thread')),
  parent_id uuid not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  is_hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_parent_idx on public.comments (parent_type, parent_id, created_at);

-- =============================================================
-- COMMUNITY: discussion board, polls, suggestions, messages
-- =============================================================
create table public.board_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text
);

create table public.board_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.board_categories(id) on delete set null,
  title text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null, -- [{id, label}]
  status poll_status not null default 'open',
  created_by uuid references public.profiles(id) on delete set null,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  option_id text not null,
  created_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  upvotes int not null default 0,
  status text not null default 'open' check (status in ('open','planned','done','declined')),
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_thread_idx on public.messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);

create table public.volunteer_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  role_description text not null,
  hours numeric(5,2),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================================
-- SPONSORS, DOCUMENTS, NEWSLETTER, SETTINGS, AUDIT LOG
-- =============================================================
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  tier text not null default 'partner' check (tier in ('platinum','guld','silver','partner')),
  sort_order int not null default 0
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_path text not null,
  category text not null default 'ovrigt',
  is_public boolean not null default true,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  confirmed boolean not null default false,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  body text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
