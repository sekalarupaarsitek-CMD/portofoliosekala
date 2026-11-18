-- ============================================================================
-- TABEL TESTIMONI & FAQ — SEKALARUPA STUDIO ARSITEK (ADMIN CMS)
-- Cara pakai:
-- 1. Buka Dashboard Supabase -> menu "SQL Editor" -> klik "New query"
-- 2. Copy-paste seluruh isi file ini, lalu klik tombol "Run"
-- ============================================================================

-- 1. Tabel `testimonials`
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_label text,
  quote text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Publik bisa membaca testimoni yang tayang" on public.testimonials;
drop policy if exists "Admin login punya akses penuh ke testimoni" on public.testimonials;

create policy "Publik bisa membaca testimoni yang tayang"
  on public.testimonials
  for select
  using (is_published = true);

create policy "Admin login punya akses penuh ke testimoni"
  on public.testimonials
  for all
  to authenticated
  using (true)
  with check (true);

-- 2. Tabel `faqs`
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

drop policy if exists "Publik bisa membaca faq yang tayang" on public.faqs;
drop policy if exists "Admin login punya akses penuh ke faq" on public.faqs;

create policy "Publik bisa membaca faq yang tayang"
  on public.faqs
  for select
  using (is_published = true);

create policy "Admin login punya akses penuh ke faq"
  on public.faqs
  for all
  to authenticated
  using (true)
  with check (true);

-- 3. Isi data awal FAQ jika tabel masih kosong (agar langsung bisa diedit di Admin CMS)
insert into public.faqs (question, answer, is_published, sort_order)
select v.question, v.answer, true, v.sort_order
from (values
  (
    'Bagaimana cara memulai konsultasi desain di Sekalarupa?',
    'Anda dapat langsung menekan tombol Konsultasi (WhatsApp) atau mengisi Form Konsultasi di halaman ini. Tim kami akan menjadwalkan diskusi awal untuk memahami kebutuhan ruang, lokasi lahan, serta estimasi anggaran Anda.',
    1
  ),
  (
    'Apa saja dokumen yang diterima pada tahap Serah Terima?',
    'Anda akan menerima paket dokumen lengkap yang mencakup konsep desain, denah tata ruang, visualisasi 3D interior & eksterior, serta Gambar Kerja teknis (skematik arsitektur, struktur dasar, MEP, dan detailing) sebagai acuan pembangunan.',
    2
  ),
  (
    'Apakah Sekalarupa melayani proyek di luar Bandung Barat?',
    'Ya. Studio kami berlokasi di Cililin, Bandung Barat, namun kami melayani perancangan proyek di berbagai kota di Indonesia melalui kombinasi koordinasi daring dan kunjungan survey lokasi sesuai kesepakatan.',
    3
  ),
  (
    'Apakah bisa memesan salah satu layanan saja, seperti Interior atau Custom Furniture?',
    'Tentu bisa. Anda dapat memilih layanan secara menyeluruh maupun spesifik sesuai kebutuhan, mulai dari Rumah Tinggal, Desain Interior, Desain Eksterior, Custom Furniture, hingga Landscape.',
    4
  ),
  (
    'Bagaimana sistem revisi selama proses perancangan berlangsung?',
    'Setiap tahapan—mulai dari denah, konsep 3D, hingga pengembangan desain—dilakukan secara bertahap bersama Anda. Revisi disepakati di setiap tahap sebelum lanjut ke tahap Gambar Kerja agar hasil akhir benar-benar sesuai harapan.',
    5
  )
) as v(question, answer, sort_order)
where not exists (select 1 from public.faqs);
