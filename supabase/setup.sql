-- Run in your Supabase project's SQL Editor. Safe to run again.
begin;
create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
drop policy if exists "Admins can check their membership" on public.portfolio_admins;
create policy "Admins can check their membership" on public.portfolio_admins
  for select to authenticated using (user_id = (select auth.uid()));
-- No client can insert/update membership. Add admins through the SQL Editor.

create table if not exists public.portfolio_content (
  id integer primary key default 1 check (id = 1),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
drop policy if exists "Published portfolio is public" on public.portfolio_content;
create policy "Published portfolio is public" on public.portfolio_content
  for select to anon, authenticated using (true);

-- One atomic publication prevents partial updates and stale overwrites.
-- No direct table writes are granted; the function verifies admin membership.
create or replace function public.publish_portfolio_content(p_content jsonb, p_expected_revision integer)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  saved public.portfolio_content;
begin
  if auth.uid() is null or not exists (
    select 1 from public.portfolio_admins where user_id = auth.uid()
  ) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 or p_content is null
     or jsonb_typeof(p_content) is distinct from 'object'
     or jsonb_typeof(p_content->'site') is distinct from 'object'
     or jsonb_typeof(p_content->'projects') is distinct from 'array'
     or octet_length(p_content::text) > 4194304 then
    raise exception 'Invalid portfolio content' using errcode = '22023';
  end if;
  if p_expected_revision = 0 then
    insert into public.portfolio_content (id, content, revision)
    values (1, p_content, 1) on conflict (id) do nothing returning * into saved;
  else
    update public.portfolio_content
    set content = p_content, revision = revision + 1, updated_at = now()
    where id = 1 and revision = p_expected_revision returning * into saved;
  end if;
  if saved.id is null then
    raise exception 'Published content changed; reload before publishing' using errcode = '40001';
  end if;
  return jsonb_build_object('content', saved.content, 'revision', saved.revision, 'updated_at', saved.updated_at);
end;
$$;
revoke all on function public.publish_portfolio_content(jsonb, integer) from public, anon;
grant execute on function public.publish_portfolio_content(jsonb, integer) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Portfolio admins can upload images" on storage.objects;
create policy "Portfolio admins can upload images" on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.portfolio_admins where user_id = (select auth.uid()))
);
-- Public bucket URLs permit downloads. Replacements use new names;
-- clients cannot delete/overwrite images used by published content.
commit;

-- After creating your email/password user in Authentication > Users, run:
-- insert into public.portfolio_admins (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict do nothing;
