-- ============================================================================
-- TABEL 04-TENTANG — SEKALARUPA STUDIO ARSITEK (ADMIN CMS)
-- Cara pakai:
-- 1. Buka Dashboard Supabase -> menu "SQL Editor" -> klik "New query"
-- 2. Copy-paste seluruh isi file ini, lalu klik tombol "Run"
-- ============================================================================

create table if not exists public.about_section (
  id text primary key default 'main',
  title text not null,
  quote text,
  description text not null,
  image_url text not null,
  founder_name text,
  founder_role text,
  updated_at timestamptz not null default now()
);

alter table public.about_section enable row level security;

drop policy if exists "Publik bisa membaca bagian tentang" on public.about_section;
drop policy if exists "Admin login punya akses penuh ke bagian tentang" on public.about_section;

create policy "Publik bisa membaca bagian tentang"
  on public.about_section
  for select
  using (true);

create policy "Admin login punya akses penuh ke bagian tentang"
  on public.about_section
  for all
  to authenticated
  using (true)
  with check (true);

-- Isi data awal sesuai konten Sekalarupa saat ini (hanya jika belum ada)
insert into public.about_section (
  id, title, quote, description, image_url, founder_name, founder_role
) values (
  'main',
  'Di balik Sekalarupa',
  '“Tatar Rupa Mawa Bagja” — Menata wujud dan ruang yang menghadirkan kebahagiaan.',
  E'Nama Sekalarupa lahir dari pertemuan dua esensi mendasar: Sekala, dimensi nyata yang terukur, fungsional, dan berpijak pada ketelitian skala arsitektur; serta Rupa, wujud visual, keindahan bentuk, dan rasa yang menghidupkan setiap sudut ruang.\n\nBagi kami, arsitektur bukan sekadar mendirikan bidang dan material, melainkan menyelaraskan kebutuhan hidup, iklim sekitar, dan kebiasaan manusia di dalamnya. Baik dalam perancangan rumah tinggal, interior, eksterior, lanskap, hingga detail furnitur kustom, kami merancang ruang yang tenang, jujur, dan berkesinambungan.',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
  'M Fahmi Shofiyulloh',
  'Pendiri & Principal Architect'
)
on conflict (id) do nothing;
