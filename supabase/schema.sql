-- ChromaVibe: skema basis data
-- Jalankan seluruh berkas ini di SQL Editor Supabase.
--
-- Tema tidak disimpan di tabel karena definisinya adalah konfigurasi kode
-- (src/lib/palette/themes.js). Menduplikasinya ke basis data akan membuat dua
-- sumber kebenaran yang cepat melenceng.

create extension if not exists pgcrypto;

create table if not exists palet (
  id uuid primary key default gen_random_uuid(),
  tema_slug text not null,
  slug text not null unique,
  nama text not null,
  harmoni text not null,
  warna jsonb not null,
  pasangan_kontras jsonb not null default '[]'::jsonb,
  ringkasan jsonb,
  dibuat_pada timestamptz not null default now()
);

create index if not exists idx_palet_tema_slug on palet (tema_slug);

alter table palet enable row level security;

-- Tabel yang dibuat lewat SQL Editor tidak otomatis mendapat hak akses untuk
-- role API Supabase. Tanpa blok GRANT berikut, permintaan akan gagal dengan
-- kode 42501 "permission denied for table palet" walau kuncinya benar.
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.palet to service_role;
grant select on public.palet to anon;

-- Aplikasi membaca dan menulis lewat server yang memakai service role, tetapi
-- kebijakan baca publik tetap dipasang agar data bisa diperiksa dari dasbor.
drop policy if exists "palet_baca_publik" on palet;
create policy "palet_baca_publik" on palet
  for select
  to anon
  using (true);
