# PRD: Website Portofolio Jasa Desain Arsitek + Admin CMS

> File ini adalah SUMBER KEBENARAN proyek. Agent wajib membaca file ini di awal setiap sesi dan mengikutinya. Jika ada permintaan yang bertentangan dengan PRD, tanyakan dulu kepada pemilik proyek sebelum mengubah apa pun.

---

## 1. Ringkasan Proyek

- **Nama bisnis:** Sekalarupa Studio Arsitek
- **Tagline:** Tatar Rupa Mawa Bagja
- **Pemilik studio:** M Fahmi Shofiyulloh
- **Jenis usaha:** Rumah tinggal, interior, eksterior, furniture, landscape
- **Tujuan website:** Menampilkan portofolio secara elegan, membangun kepercayaan, dan mengubah pengunjung menjadi calon klien yang menghubungi lewat WhatsApp atau form.
- **Target pengunjung:** Calon klien pribadi dan pemilik properti di Indonesia.
- **Bahasa antarmuka:** Bahasa Indonesia.
- **Pemilik proyek:** Pemula dalam coding. Semua penjelasan harus sederhana, dan setiap langkah harus bisa dites di browser.

## 2. Tujuan & Indikator Berhasil

1. Pengunjung memahami layanan dan melihat hasil karya dalam kurang dari 1 menit.
2. Pemilik bisa menambah, mengubah, dan menyembunyikan proyek portofolio lewat `/admin` tanpa menyentuh kode.
3. Website cepat dan nyaman di HP (mayoritas pengunjung memakai HP).
4. Website online di domain sendiri lewat Vercel.

## 3. Tech Stack (TIDAK BOLEH diganti tanpa persetujuan)

| Bagian | Teknologi |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database, Auth, Storage | Supabase (paket gratis) |
| Deploy | Vercel, repository di GitHub |
| Font | `next/font` (Google Fonts) |
| Gambar | Komponen `next/image` |

**Aturan dependensi:** jangan menambah library baru di luar daftar ini tanpa menjelaskan alasannya dan meminta persetujuan. Hindari UI library berat. Cukup Tailwind dan komponen buatan sendiri.

## 4. Arah Desain (Arsitektural)

- **Gaya:** minimalis, lega, tegas, simetris. Terasa seperti majalah arsitektur.
- **Whitespace:** banyak. Jangan membuat halaman terasa padat.
- **Warna:** netral. Putih/krem (`#FAFAF8`), abu hangat, hitam (`#111111`). Satu warna aksen tipis saja (misal: `#8A7B6A` taupe). Tanpa gradien mencolok.
- **Tipografi:** judul memakai serif elegan (contoh: *Playfair Display* atau *Cormorant Garamond*), isi memakai sans-serif bersih (contoh: *Inter*). Judul besar dengan jarak huruf yang rapi.
- **Foto:** jadi bintang utama. Besar, full-width, rasio konsisten. Hindari ikon dan ilustrasi berlebihan.
- **Layout:** grid yang jelas, garis tipis (hairline) sebagai pembatas, sudut tidak membulat berlebihan.
- **Animasi:** halus dan seperlunya (fade-in saat scroll, hover pada kartu proyek). Tidak ada animasi yang mengganggu.
- **Responsif:** desain mobile-first. Wajib rapi di lebar 360px, 768px, dan 1280px.

## 5. Struktur Halaman Publik

| Rute | Isi |
|---|---|
| `/` | Landing page (bagian di bawah) |
| `/portofolio` | Semua proyek tayang, dengan filter kategori |
| `/portofolio/[slug]` | Detail proyek: galeri foto, deskripsi, owner/pemilik, lokasi, tahun, luas, kategori |
| `/kontak` | Info kontak + form (opsional, bisa digabung di landing) |

**Bagian landing page (urutan):**
1. **Navbar:** logo resmi (putih saat di atas Beranda, berubah halus menjadi hitam saat di-scroll), menu (Layanan, Portofolio, Tentang, Kontak), tombol WhatsApp.
2. **Hero:** gambar arsitektur sebagai background layar penuh, teks putih, headline utama, tagline *“tatar rupa mawa bagja”*, tombol "Lihat Portofolio" (scroll ke `#portofolio`), "Konsultasi" (WhatsApp), dan "Jelajahi →" (scroll ke `#layanan`).
3. **Layanan:** 5 kartu ringkas sejajar (Rumah Tinggal, Desain Interior, Desain Eksterior, Custom Furniture, Landscape). Isi teks cukup di dalam kode.
4. **Portofolio unggulan:** 6 proyek berstatus `is_featured` (tampilan murni gambar, judul/kategori muncul dengan animasi saat kursor diarahkan ke foto), ambil dari database, tautan ke `/portofolio`.
5. **Proses kerja:** 6 langkah (Konsultasi → Survey Lokasi (Mapping Area) → Proposal Desain → Desain (Denah, Interior, Eksterior) → Gambar Kerja (Skematik, MEP, Detailing) → Serah Terima).
6. **Tentang:** foto dan filosofi Sekala & Rupa beserta nama pemilik (M Fahmi Shofiyulloh).
7. **Kontak:** layout ringkas & presisi dengan tombol "Konsultasi" (WhatsApp) dan "EMAIL", 4 kotak info singkat (WhatsApp, Email, Lokasi, Sosial Media), serta **Form Konsultasi** di bawahnya (Nama, Lokasi, Luas Lahan, Jenis Desain: Arsitektur/Interior/Eksterior/Furniture, Kontak, dan Email) yang langsung terhubung ke WhatsApp.
8. **Testimoni:** 3 kartu kesan klien (ditandai sebagai contoh/placeholder sampai ulasan asli tersedia).
9. **FAQ:** daftar pertanyaan umum interaktif (akordeon) seputar konsultasi dan proses desain.
10. **Footer:** logo resmi, tagline, tautan navigasi & sosial media, hak cipta.

**Konten placeholder:** selama konten asli belum ada, gunakan teks dan foto contoh yang jelas bertanda placeholder. Jangan mengarang klaim (jumlah proyek, penghargaan, testimoni palsu).

## 6. Admin CMS

**Rute:**
- `/admin/login`: halaman login
- `/admin`: daftar proyek (tabel/kartu)
- `/admin/projects/new`: tambah proyek
- `/admin/projects/[id]/edit`: edit proyek

**Fitur wajib (versi 1):**
- Login email + password (Supabase Auth).
- Semua rute `/admin/*` (kecuali login) dilindungi. Jika belum login, arahkan ke `/admin/login`.
- CRUD proyek: tambah, lihat, edit, hapus (dengan konfirmasi sebelum menghapus).
- Upload foto sampul dan galeri (beberapa foto) ke Supabase Storage, dengan pratinjau sebelum simpan.
- Toggle **Tayang/Draft** dan toggle **Unggulan**.
- Pengaturan urutan tampil (`sort_order`, cukup angka).
- Pesan sukses/gagal yang jelas setiap aksi.

**Keamanan admin:**
- Hanya ada 1 akun admin, dibuat manual lewat dashboard Supabase.
- Nonaktifkan pendaftaran publik (sign-up) di Supabase.
- Halaman admin diberi `noindex` agar tidak muncul di Google.

## 7. Model Data (Supabase)

**Tabel `projects`:**

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK, default gen_random_uuid()) | |
| `title` | text, wajib | Judul proyek |
| `slug` | text, unik, wajib | Untuk URL, dibuat otomatis dari judul |
| `owner` | text | Nama pemilik / owner proyek |
| `category` | text, wajib | `rumah`, `interior`, `eksterior`, `furniture`, `landscape`, `renovasi`, `komersial` |
| `description` | text | Deskripsi proyek |
| `location` | text | Kota/lokasi |
| `year` | int | Tahun proyek |
| `area_sqm` | int | Luas (m²), opsional |
| `cover_image_url` | text, wajib | Foto sampul |
| `gallery` | text[] | Daftar URL foto galeri |
| `is_published` | boolean, default false | Tayang atau draft |
| `is_featured` | boolean, default false | Tampil di landing page |
| `sort_order` | int, default 0 | Urutan tampil |
| `created_at` | timestamptz, default now() | |

**Storage:** satu bucket publik bernama `project-images`.

**Row Level Security (WAJIB aktif):**
- Pengunjung umum: hanya boleh **membaca** baris dengan `is_published = true`.
- User yang login (admin): boleh membaca, menambah, mengubah, dan menghapus semua baris.
- Storage: baca publik, tulis/hapus hanya untuk user login.

## 8. Aturan Teknis untuk Agent

1. **Kerjakan SATU fase per permintaan** (lihat bagian 9). Setelah selesai, berhenti, jelaskan hasilnya, dan tunggu konfirmasi.
2. **Jelaskan dengan bahasa sederhana.** Pemilik proyek pemula. Sebutkan file apa yang dibuat atau diubah dan kenapa.
3. **Jangan menulis ulang file yang sudah jalan** kecuali diminta. Ubah seperlunya saja.
4. **Rahasia dan kunci API:** simpan di `.env.local`, pastikan `.env.local` ada di `.gitignore`, dan jangan pernah ditulis langsung di kode atau di-commit. Sediakan file `.env.example` berisi nama variabel tanpa nilai.
5. **Variabel environment yang dipakai:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`. Jangan pernah memakai service role key di sisi browser.
6. **Struktur folder dasar:**
   ```
   src/
     app/            -> halaman & rute
       (public)/     -> halaman publik
       admin/        -> halaman admin
     components/     -> komponen UI (ui/, sections/, admin/)
     lib/            -> helper (supabase client, utils)
     types/          -> tipe TypeScript
   ```
7. **Kode rapi:** TypeScript tanpa `any`, nama file dan variabel jelas, komponen kecil dan bisa dipakai ulang, komentar singkat pada bagian yang tidak jelas.
8. **Performa:** gunakan `next/image` dengan ukuran yang benar, `loading="lazy"` untuk foto di bawah layar, dan hindari file besar.
9. **SEO dasar:** `metadata` per halaman (title, description, Open Graph), `alt` pada setiap gambar, heading berurutan (satu `h1` per halaman), `sitemap` dan `robots`.
10. **Aksesibilitas:** kontras teks cukup, tombol bisa difokus lewat keyboard, label pada form.
11. **Jika ada error:** jelaskan penyebabnya dengan bahasa sederhana, lalu perbaiki. Jangan mengganti pendekatan secara diam-diam.
12. **Jika ada hal yang tidak jelas di PRD:** tanya dulu, jangan berasumsi.
13. **Jangan membuat fitur di luar PRD** (lihat bagian 10).

## 9. Fase Pengerjaan

Selesaikan berurutan. Setiap fase punya kriteria selesai yang harus dites pemilik di browser.

### Fase 1: Setup Project
- Buat project Next.js + TypeScript + Tailwind, rapikan struktur folder, atur font dan warna global (design tokens di Tailwind).
- **Selesai jika:** `npm run dev` jalan dan halaman awal tampil di `localhost:3000`.

### Fase 2: Landing Page (data statis dulu)
- Bangun bagian landing satu per satu sesuai bagian 5, dengan data portofolio contoh (hardcode).
- **Selesai jika:** semua bagian tampil rapi di HP dan desktop, tombol WhatsApp berfungsi.

### Fase 3: Halaman Portofolio
- `/portofolio` dengan filter kategori dan `/portofolio/[slug]` dengan galeri, masih memakai data contoh.
- **Selesai jika:** klik kartu membuka detail, filter bekerja.

### Fase 4: Supabase (Database + Storage)
- Buat tabel, bucket, dan RLS sesuai bagian 7. Pandu pemilik membuat project Supabase dan mengisi `.env.local`.
- **Selesai jika:** pemilik bisa menambah 1 data lewat dashboard Supabase dan data itu muncul di website.

### Fase 5: Admin CMS
- Login, proteksi rute, CRUD proyek, upload foto, toggle tayang/unggulan.
- Ganti data contoh di landing dan portofolio dengan data dari database.
- **Selesai jika:** pemilik login, menambah proyek dengan foto, menandainya tayang, lalu proyek itu muncul di website publik.

### Fase 6: Poles & SEO
- Metadata, sitemap, favicon, halaman 404, cek performa dan responsif, semua teks placeholder diganti konten asli.
- **Selesai jika:** skor Lighthouse mobile minimal 85 untuk Performance dan SEO.

### Fase 7: Deploy
- Push ke GitHub, hubungkan ke Vercel, isi environment variables, hubungkan domain.
- **Selesai jika:** website bisa dibuka di domain sendiri dan admin berfungsi di versi online.

## 10. Di Luar Cakupan (JANGAN DIBUAT di Versi 1)

- Sistem pembayaran / e-commerce
- Registrasi atau login untuk pengunjung
- Blog atau artikel
- Multi-bahasa (hanya Bahasa Indonesia)
- Chat langsung atau chatbot
- Banyak peran admin (hanya 1 admin)
- Dashboard statistik
- Aplikasi mobile

**Kandidat pengembangan berikutnya (versi 2), hanya jika diminta:** otomasi AI, misalnya chatbot yang menjawab calon klien, form kontak yang otomatis dikirim ke WhatsApp/email, atau pembuatan deskripsi proyek otomatis di admin.

## 11. Data yang Disiapkan Pemilik

- [x] Logo (format PNG/SVG, latar transparan)
- [ ] 5–10 foto proyek terbaik (sudah dikompres, maks. 1 MB per foto)
- [ ] Deskripsi singkat tiap proyek (lokasi, tahun, luas, cerita singkat)
- [x] Teks "Tentang" + foto profil (teks filosofi sudah, tinggal foto profil asli)
- [x] Nomor WhatsApp (`087857523074` / `6287857523074`), email (`sekalarupa.arsitek@gmail.com`), lokasi (`Cililin, Bandung Barat`), jam kerja
- [x] Tautan sosial media (Instagram: `https://www.instagram.com/sekalarupa.arsitek/`, TikTok: `https://www.tiktok.com/@sekalarupa`, YouTube: `https://www.youtube.com/@SekalarupaArsitek`)
- [x] Pilihan nama domain (`https://sekalarupaarsitek.com`)

## 12. Cara Memulai Sesi dengan Agent

Setiap membuka sesi baru, mulai dengan:

> "Baca `PRD.md` di root project. Kita sedang di **Fase [nomor]**. Kerjakan hanya fase itu, jelaskan dengan bahasa sederhana, dan berhenti setelah selesai agar saya bisa tes."