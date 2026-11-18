# Sekalarupa Studio Arsitek — Website Portofolio & Admin CMS

Website resmi **Sekalarupa Studio Arsitek** (*Tatar Rupa Mawa Bagja*) — jasa desain arsitektur untuk rumah tinggal, interior, eksterior, custom furniture, dan landscape.

## Teknologi
- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **Database, Auth, Storage:** Supabase
- **Deploy:** Vercel

## Menjalankan di Komputer Lokal
1. Salin `.env.example` menjadi `.env.local` lalu isi nilai variabelnya.
2. Jalankan instalasi dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000` (Website Publik) dan `http://localhost:3000/admin` (Admin CMS).

## Variabel Environment (Vercel & Lokal)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL` *(URL domain online Anda, misal `https://sekalarupa.com`)*
