-- ============================================================================
-- TABEL BERANDA / HERO — SEKALARUPA STUDIO ARSITEK (ADMIN CMS)
-- Cara pakai:
-- 1. Buka Dashboard Supabase -> menu "SQL Editor" -> klik "New query"
-- 2. Copy-paste seluruh isi file ini, lalu klik tombol "Run"
-- ============================================================================

create table if not exists public.hero_section (
  id text primary key default 'main',
  title text not null,
  tagline text,
  description text not null,
  background_image_url text not null,
  text_style text not null default 'sans'
    check (text_style in ('sans', 'serif', 'serif-italic', 'uppercase')),
  updated_at timestamptz not null default now()
);

alter table public.hero_section enable row level security;

drop policy if exists "Publik bisa membaca bagian beranda" on public.hero_section;
drop policy if exists "Admin login punya akses penuh ke bagian beranda" on public.hero_section;

create policy "Publik bisa membaca bagian beranda"
  on public.hero_section
  for select
  using (true);

create policy "Admin login punya akses penuh ke bagian beranda"
  on public.hero_section
  for all
  to authenticated
  using (true)
  with check (true);

-- Isi data awal sesuai tampilan Beranda Sekalarupa saat ini (hanya jika belum ada)
insert into public.hero_section (
  id, title, tagline, description, background_image_url, text_style
) values (
  'main',
  'Wujudkan Hunian yang Membawa Kebahagiaan',
  'tatar rupa mawa bagja',
  'Merancang rumah tinggal, interior, eksterior, furniture, dan landscape dengan proporsi yang tenang, fungsional, serta berkarakter.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
  'sans'
)
on conflict (id) do nothing;
