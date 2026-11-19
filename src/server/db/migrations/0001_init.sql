-- Hidoyat: boshlangʻich sxema, rollar va Row Level Security siyosatlari.
-- Barcha soʻrovlar ilova tomonidan `app_user` rolida bajariladi (SET LOCAL ROLE),
-- foydalanuvchi identifikatori esa tranzaksiya sozlamasida (app.user_id) uzatiladi.

do $$ begin
  create role app_user nologin;
exception when duplicate_object then null;
end $$;

do $$ begin
  execute format('grant app_user to %I', current_user);
exception when others then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and length(email) <= 254),
  password_hash text not null,
  display_name text check (length(display_name) <= 80),
  role text not null default 'user' check (role in ('user', 'editor', 'reviewer', 'admin')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table if not exists sessions (
  id text primary key,                 -- SHA-256(token) — xom token hech qachon saqlanmaydi
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  user_agent text
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists user_data (
  user_id uuid not null references users(id) on delete cascade,
  key text not null check (key ~ '^[a-zA-Z][a-zA-Z0-9_]{1,40}$'),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  check (pg_column_size(value) < 524288)
);

create table if not exists rate_limits (
  key text primary key,
  count integer not null,
  reset_at timestamptz not null
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('dua', 'dhikr', 'hadith', 'article', 'glossary')),
  slug text not null check (slug ~ '^[a-z0-9-]{1,60}$'),
  title text not null,
  description text,
  icon text,
  sort integer not null default 0,
  unique (type, slug)
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9-]{1,60}$'),
  title text not null,
  author text,
  kind text not null check (kind in ('quran', 'translation', 'hadith', 'book', 'website', 'dataset', 'institution')),
  publisher text,
  url text check (url is null or url ~ '^https?://'),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('dua', 'dhikr', 'hadith', 'article', 'lesson', 'quiz', 'glossary', 'event')),
  slug text not null check (slug ~ '^[a-z0-9-]{1,80}$'),
  category text,
  title text not null check (length(title) between 1 and 200),
  summary text,
  body jsonb not null default '{}'::jsonb,
  refs jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'changes_requested', 'published', 'rejected', 'archived')),
  origin text not null default 'editor' check (origin in ('editor', 'ai_draft', 'import')),
  sort integer not null default 0,
  version integer not null default 1,
  search_text text not null default '',
  created_by uuid references users(id) on delete set null,
  updated_by uuid references users(id) on delete set null,
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);
create index if not exists content_type_status_idx on content_items(type, status, category, sort);

create table if not exists content_revisions (
  id bigserial primary key,
  content_id uuid not null references content_items(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  changed_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists content_revisions_idx on content_revisions(content_id, version desc);

create table if not exists review_events (
  id bigserial primary key,
  content_id uuid not null references content_items(id) on delete cascade,
  actor_id uuid references users(id) on delete set null,
  action text not null check (action in ('create', 'edit', 'submit', 'approve', 'request_changes', 'reject', 'archive', 'restore')),
  from_status text,
  to_status text,
  note text check (length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists review_events_idx on review_events(content_id, created_at desc);

create table if not exists audit_log (
  id bigserial primary key,
  actor_id uuid references users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────── Kontekst funksiyalari ───────────────
create or replace function app_uid() returns uuid language sql stable as $$
  select nullif(current_setting('app.user_id', true), '')::uuid
$$;

-- Rol foydalanuvchi yozuvidan olinadi (mijoz tomonidan yuborilgan qiymatdan emas).
create or replace function app_role() returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from users where id = app_uid() and status = 'active'), 'anon')
$$;
revoke all on function app_role() from public;
grant execute on function app_role() to app_user;
grant execute on function app_uid() to app_user;

create or replace function is_staff() returns boolean language sql stable as $$
  select app_role() in ('editor', 'reviewer', 'admin')
$$;
grant execute on function is_staff() to app_user;

-- ─────────────── Ruxsatlar ───────────────
grant usage on schema public to app_user;
grant select, update on users to app_user;
grant select, insert, update, delete on user_data to app_user;
grant select, insert, update, delete on content_items to app_user;
grant select on content_revisions to app_user;
grant select, insert on review_events to app_user;
grant select, insert, update, delete on categories to app_user;
grant select, insert, update, delete on sources to app_user;
grant select, insert on audit_log to app_user;
grant usage on all sequences in schema public to app_user;
-- sessions va rate_limits jadvallariga app_user kira olmaydi (faqat tizim yoʻli).

-- ─────────────── RLS ───────────────
alter table users enable row level security;
alter table user_data enable row level security;
alter table content_items enable row level security;
alter table content_revisions enable row level security;
alter table review_events enable row level security;
alter table categories enable row level security;
alter table sources enable row level security;
alter table audit_log enable row level security;

drop policy if exists users_select on users;
create policy users_select on users for select to app_user using (id = app_uid() or app_role() = 'admin');
drop policy if exists users_update on users;
create policy users_update on users for update to app_user using (id = app_uid() or app_role() = 'admin') with check (id = app_uid() or app_role() = 'admin');

drop policy if exists user_data_owner on user_data;
create policy user_data_owner on user_data for all to app_user using (user_id = app_uid()) with check (user_id = app_uid());

drop policy if exists content_select on content_items;
create policy content_select on content_items for select to app_user using (
  status = 'published'
  or is_staff()
  or (status = 'in_review' and current_setting('app.show_pending', true) = 'on')
);
drop policy if exists content_insert on content_items;
create policy content_insert on content_items for insert to app_user with check (is_staff() and status in ('draft', 'in_review'));
drop policy if exists content_update on content_items;
create policy content_update on content_items for update to app_user using (is_staff()) with check (is_staff());
drop policy if exists content_delete on content_items;
create policy content_delete on content_items for delete to app_user using (app_role() = 'admin');

drop policy if exists revisions_select on content_revisions;
create policy revisions_select on content_revisions for select to app_user using (is_staff());

drop policy if exists review_select on review_events;
create policy review_select on review_events for select to app_user using (is_staff());
drop policy if exists review_insert on review_events;
create policy review_insert on review_events for insert to app_user with check (is_staff() and actor_id = app_uid());

drop policy if exists categories_select on categories;
create policy categories_select on categories for select to app_user using (true);
drop policy if exists categories_write on categories;
create policy categories_write on categories for all to app_user using (app_role() = 'admin') with check (app_role() = 'admin');

drop policy if exists sources_select on sources;
create policy sources_select on sources for select to app_user using (true);
drop policy if exists sources_insert on sources;
create policy sources_insert on sources for insert to app_user with check (is_staff());
drop policy if exists sources_update on sources;
create policy sources_update on sources for update to app_user using (is_staff()) with check (is_staff());
drop policy if exists sources_delete on sources;
create policy sources_delete on sources for delete to app_user using (app_role() = 'admin');

drop policy if exists audit_select on audit_log;
create policy audit_select on audit_log for select to app_user using (app_role() = 'admin');
drop policy if exists audit_insert on audit_log;
create policy audit_insert on audit_log for insert to app_user with check (is_staff() and actor_id = app_uid());

-- ─────────────── Triggerlar: tekshiruv jarayoni qoidalari ───────────────
create or replace function users_guard() returns trigger language plpgsql as $$
begin
  if current_user = 'app_user' and app_role() <> 'admin' then
    if new.role is distinct from old.role or new.status is distinct from old.status or new.email is distinct from old.email or new.password_hash is distinct from old.password_hash then
      raise exception 'Ruxsat yoʻq: bu maydonlarni faqat administrator oʻzgartira oladi' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists users_guard_trg on users;
create trigger users_guard_trg before update on users for each row execute function users_guard();

create or replace function content_guard() returns trigger language plpgsql as $$
declare
  r text := app_role();
  uid uuid := app_uid();
  content_changed boolean := tg_op = 'INSERT' or new.body is distinct from old.body or new.title is distinct from old.title
    or new.refs is distinct from old.refs or new.summary is distinct from old.summary or new.category is distinct from old.category;
begin
  if current_user <> 'app_user' then
    return new; -- tizim yoʻli (migratsiya, seed)
  end if;

  if content_changed then
    new.updated_by := uid;
    new.updated_at := now();
    if tg_op = 'UPDATE' then new.version := old.version + 1; end if;
    -- Tasdiqlangan kontent mazmuni oʻzgarsa, qayta tekshiruvga qaytadi.
    if tg_op = 'UPDATE' and old.status = 'published' and new.status = 'published' then
      new.status := 'in_review';
      new.reviewed_by := null;
      new.reviewed_at := null;
    end if;
  end if;

  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    if r not in ('reviewer', 'admin') then
      raise exception 'Faqat tekshiruvchi yoki administrator nashrga ruxsat bera oladi' using errcode = '42501';
    end if;
    if r <> 'admin' and tg_op = 'UPDATE' and old.updated_by = uid then
      raise exception 'Oʻzingiz tahrirlagan kontentni oʻzingiz tasdiqlay olmaysiz (toʻrt koʻz tamoyili)' using errcode = '42501';
    end if;
    new.reviewed_by := uid;
    new.reviewed_at := now();
    new.published_at := now();
  end if;

  if tg_op = 'UPDATE' and new.status in ('rejected', 'changes_requested') and old.status is distinct from new.status and r not in ('reviewer', 'admin') then
    raise exception 'Faqat tekshiruvchi rad eta yoki tuzatish soʻray oladi' using errcode = '42501';
  end if;

  if new.status = 'in_review' and (tg_op = 'INSERT' or old.status <> 'in_review') then
    new.submitted_at := now();
  end if;
  return new;
end $$;
drop trigger if exists content_guard_trg on content_items;
create trigger content_guard_trg before insert or update on content_items for each row execute function content_guard();

create or replace function content_revision() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.version <> old.version then
    insert into content_revisions(content_id, version, snapshot, changed_by)
    values (old.id, old.version, jsonb_build_object('title', old.title, 'summary', old.summary, 'category', old.category, 'body', old.body, 'refs', old.refs, 'status', old.status), new.updated_by);
  end if;
  return new;
end $$;
drop trigger if exists content_revision_trg on content_items;
create trigger content_revision_trg after update on content_items for each row execute function content_revision();
