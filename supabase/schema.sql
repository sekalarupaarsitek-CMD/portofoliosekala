-- ============================================================================
-- SKEMA DATABASE & STORAGE SUPABASE — SEKALARUPA STUDIO ARSITEK (FASE 4)
-- Cara pakai:
-- 1. Buka Dashboard Supabase project Anda -> menu "SQL Editor" -> klik "New query"
-- 2. Copy-paste seluruh isi file ini ke editor, lalu klik tombol "Run"
-- ============================================================================

-- 1. Buat tabel `projects` sesuai PRD Bagian 7
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  owner text,
  category text not null default 'rumah'
    check (category in ('rumah', 'interior', 'eksterior', 'furniture', 'landscape', 'renovasi', 'komersial')),
  description text,
  location text,
  year integer,
  area_sqm integer,
  cover_image_url text not null,
  gallery text[] not null default '{}',
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Index agar pencarian slug & pengurutan cepat
create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_published_sort on public.projects (is_published, is_featured, sort_order);

-- 2. Aktifkan Row Level Security (RLS) pada tabel `projects`
alter table public.projects enable row level security;

-- Hapus policy lama jika pernah dijalankan sebelumnya (agar tidak bentrok saat Run ulang)
drop policy if exists "Publik bisa membaca proyek yang tayang" on public.projects;
drop policy if exists "Admin login punya akses penuh ke semua proyek" on public.projects;

-- Policy 1: Pengunjung umum hanya boleh MEMBACA baris dengan is_published = true
create policy "Publik bisa membaca proyek yang tayang"
  on public.projects
  for select
  using (is_published = true);

-- Policy 2: User yang login (Admin) boleh membaca, menambah, mengubah, dan menghapus semua baris
create policy "Admin login punya akses penuh ke semua proyek"
  on public.projects
  for all
  to authenticated
  using (true)
  with check (true);

-- 3. Buat Storage Bucket publik bernama `project-images`
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- 4. Policy RLS untuk Storage `project-images`
drop policy if exists "Publik bisa melihat foto di project-images" on storage.objects;
drop policy if exists "Admin bisa upload foto ke project-images" on storage.objects;
drop policy if exists "Admin bisa ubah foto di project-images" on storage.objects;
drop policy if exists "Admin bisa hapus foto di project-images" on storage.objects;

-- Baca publik untuk foto proyek
create policy "Publik bisa melihat foto di project-images"
  on storage.objects
  for select
  using (bucket_id = 'project-images');

-- Upload / ubah / hapus hanya untuk Admin yang login
create policy "Admin bisa upload foto ke project-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-images');

create policy "Admin bisa ubah foto di project-images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-images')
  with check (bucket_id = 'project-images');

create policy "Admin bisa hapus foto di project-images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-images');
