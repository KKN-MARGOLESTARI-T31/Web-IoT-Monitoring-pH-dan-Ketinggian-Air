# 📖 Panduan Pengguna — TEGASU IoT Monitoring

**TEGASU** — Teknologi Pertanian & Akuakultur Terpadu  
Sistem monitoring IoT berbasis web untuk memantau pH air dan ketinggian air pada sawah/kolam.

---

## Daftar Isi

1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Cara Login & Daftar Akun](#2-cara-login--daftar-akun)
3. [Lupa Password](#3-lupa-password)
4. [Dashboard Utama](#4-dashboard-utama)
5. [Memahami Status pH](#5-memahami-status-ph)
6. [Kontrol Pompa Air](#6-kontrol-pompa-air)
7. [Halaman Profil](#7-halaman-profil)
8. [Admin Dashboard](#8-admin-dashboard)
9. [Pesan dari Administrator](#9-pesan-dari-administrator)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Pengenalan Sistem

TEGASU adalah platform monitoring IoT yang menghubungkan perangkat sensor **ESP32** di lapangan dengan dashboard web yang dapat diakses dari mana saja.

| Fitur | Keterangan |
|---|---|
| 🔬 Sensor pH Real-time | Memantau kadar keasaman/kebasaan air kolam dan sawah |
| 🌊 Ketinggian Air | Selisih permukaan air dalam satuan cm |
| 🔋 Status Baterai | Daya baterai perangkat IoT di lapangan |
| 📶 Sinyal GSM (CSQ) | Kekuatan sinyal jaringan perangkat ESP32 |
| 💧 Kontrol Pompa | Hidupkan/matikan pompa dari mana saja dengan timer |
| 📊 Riwayat pH | Grafik tren perubahan pH dari waktu ke waktu |

---

## 2. Cara Login & Daftar Akun

### 🔑 Cara Masuk (Login)

1. Buka browser dan akses URL aplikasi TEGASU.
2. Masukkan **Nomor Telepon** yang terdaftar (contoh: `0812xxxxxxxx`).
3. Masukkan **Password** Anda. Klik ikon 👁 untuk menampilkan/menyembunyikan.
4. Klik tombol **"Masuk"**.
5. Sistem otomatis mengarahkan ke **Dashboard** (pengguna biasa) atau **Admin Dashboard** (administrator).

> ⚠️ **Catatan:** Jika muncul pesan "Nomor telepon atau Password salah!", pastikan nomor dan password sudah benar.

### 📝 Daftar Akun Baru

1. Di halaman Login, klik **"Daftar Akun Baru"**.
2. Isi formulir: Nama, Nomor Telepon, dan Password.
3. Klik **"Daftar"** untuk menyelesaikan pendaftaran.

> ℹ️ Akun baru secara default berstatus *pengguna biasa*. Akun admin hanya dapat dibuat oleh administrator.

---

## 3. Lupa Password

Reset password dilakukan melalui kode OTP yang dikirim via **WhatsApp**.

1. Di halaman Login, klik tautan **"Lupa Password?"**.
2. Masukkan **Nomor Telepon** yang terdaftar.
3. Klik **"Kirim OTP"** — kode dikirim ke WhatsApp Anda.
4. Masukkan **kode OTP 6 digit**. Kode berlaku selama **5 menit**.
5. Masukkan **password baru** (minimal 6 karakter).
6. Klik konfirmasi. Login kembali dengan password baru.

> 🔴 **Penting:** Jika OTP kadaluarsa, ulangi proses dari langkah 1.

---

## 4. Dashboard Utama

Setelah login, Anda langsung diarahkan ke **Dashboard IoT**. Data diperbarui otomatis setiap **5 detik**.

### Bagian-bagian Dashboard

| Bagian | Keterangan |
|---|---|
| **Header** | Nama pengguna, ikon profil (👤), dan tombol logout |
| **Pesan Admin** | Notifikasi pesan dari administrator (jika ada) |
| **Informasi Sistem** | Widget baterai dan status sinyal/koneksi perangkat |
| **Status Lahan** | Rekomendasi tindakan untuk Kolam Ikan dan Sawah Padi |
| **Monitoring & Kontrol** | Nilai pH, meter ketinggian air, dan tombol pompa |

### 🔋 Status Baterai

| Level | Status | Keterangan |
|---|---|---|
| 75% – 100% | ✅ Baik | Baterai penuh |
| 50% – 74% | 🟡 Normal | Cukup |
| 0% – 49% | 🔴 Kritis | Segera isi daya |

### 📶 Kekuatan Sinyal (CSQ)

| Nilai CSQ | Kualitas |
|---|---|
| 31 | Sangat Baik (Excellent) |
| 20 – 30 | Baik (Good) |
| 15 – 19 | Cukup (Fair) |
| 10 – 14 | Lemah (Weak) |
| 2 – 9 | Sangat Lemah (Marginal) |
| 0 – 1 | Hampir Putus (Critical) |
| 99 | Tidak Ada Sinyal |

### 🌊 Meter Ketinggian Air

Menampilkan selisih ketinggian permukaan air dalam **cm**, divisualisasikan sebagai grafik meter animasi berwarna biru.

---

## 5. Memahami Status pH

Nilai pH ditampilkan dalam angka besar berwarna yang berubah dinamis — merah (asam) → hijau (netral) → biru (basa).

### 🐟 pH untuk Kolam Ikan

| Rentang pH | Status | Tindakan |
|---|---|---|
| < 4.0 | 🔴 Bahaya: Ikan Mati | Kuras & Ganti Air Total |
| 4.0 – 6.4 | 🟡 Air Asam | Lakukan Pengapuran |
| 6.5 – 8.5 | ✅ pH Optimal | Pertahankan Kondisi |
| 8.6 – 9.5 | 🟠 Air Basa | Tambah Air Tawar |
| > 9.5 | 🔴 Bahaya: Ikan Stres | Netralisir Segera |

### 🌾 pH untuk Sawah Padi

| Rentang pH | Status | Tindakan |
|---|---|---|
| < 4.5 | 🔴 Sangat Asam | Kapur Dosis Tinggi |
| 4.5 – 5.4 | 🟠 Kurang Subur | Tabur Dolomit |
| 5.5 – 7.0 | ✅ pH Optimal | Lanjut Pemupukan |
| 7.1 – 8.0 | 🟡 Sedikit Basa | Beri Pupuk ZA |
| > 8.0 | 🟠 Terlalu Basa | Drainase & Cuci Lahan |

---

## 6. Kontrol Pompa Air

### ⚡ Menghidupkan Pompa

1. Gulir ke bagian **Monitoring & Kontrol** di bawah halaman dashboard.
2. Temukan panel **"Kontrol Pompa"** dengan ikon 💧.
3. Geser toggle ke posisi **ON** — sebuah modal akan muncul.
4. Pilih mode:
   - **Durasi tertentu** – pompa mati otomatis setelah waktu habis.
   - **Manual** – pompa aktif sampai dimatikan secara manual.
5. Klik konfirmasi. Status pompa berubah jadi *"Pompa Aktif"*.

### ⛔ Mematikan Pompa

1. Temukan panel **"Kontrol Pompa"**.
2. Geser toggle ke posisi **OFF**. Pompa langsung mati.

### Status Panel Pompa

| Status | Artinya |
|---|---|
| *Pompa Mati* | Pompa sedang tidak aktif |
| *Memproses...* | Perintah sedang dikirim ke server |
| *Pompa Aktif (Manual)* | Aktif tanpa batas waktu, matikan secara manual |
| *Sisa Waktu: HH:MM:SS* | Hitung mundur otomatis |

> ⚠️ **Catatan Penting:**
> - Jika logout saat pompa **Manual** aktif, pompa otomatis dimatikan.
> - Ada jeda minimal **2 detik** antar perintah untuk mencegah klik ganda.
> - Status pompa disinkronkan antar semua pengguna setiap **5 detik**.

---

## 7. Halaman Profil

Akses dengan klik ikon **👤** di pojok kanan atas dashboard.

### Menu yang Tersedia

#### 📋 Informasi Akun
Menampilkan nama pengguna dan nomor telepon yang terdaftar.

#### 🔋 Riwayat Aktivasi Pompa
1. Klik **"Riwayat Pompa"**.
2. Modal menampilkan 20 riwayat terakhir (status, siapa yang mengubah, waktu).

#### 📈 Riwayat pH (Grafik)
1. Klik **"Riwayat pH"**.
2. Grafik interaktif tren perubahan pH ditampilkan.

#### 🔒 Ubah Password
1. Klik **"Ubah Sandi"**.
2. Isi: *Sandi Saat Ini*, *Sandi Baru*, *Konfirmasi Sandi Baru*.
3. Minimal **6 karakter**. Klik **"Ubah Sandi"**.

> 🔴 Jika lupa password, gunakan fitur **"Lupa Password"** di halaman login.

---

## 8. Admin Dashboard

> ℹ️ **Khusus Administrator:** Hanya akun dengan peran `admin` yang dapat mengakses `/admin`. Pengguna biasa akan diarahkan ke halaman login.

Admin Dashboard memiliki **3 tab utama**:

### ⚙️ Tab Sistem
- Widget baterai perangkat
- Status online/offline perangkat IoT
- Kekuatan sinyal CSQ
- Kontrol pompa air
- Riwayat 20 aktivasi pompa terakhir
- Grafik pH historis

### 📡 Tab Monitoring
- Nilai pH real-time dengan skala warna
- Status Kolam Ikan dan Sawah Padi berdasarkan pH
- Meter ketinggian air

### 👥 Tab Pengguna

| Aksi | Cara Melakukan |
|---|---|
| Lihat Daftar Pengguna | Tab Pengguna menampilkan tabel semua akun |
| Kirim Pesan ke Pengguna | Klik ikon 💬, ketik pesan, klik "Kirim" |
| Hapus Pengguna | Klik ikon 🗑️ merah, konfirmasi dialog |

### 🔑 Ubah Password Admin
1. Klik **"Ubah Password"** di header admin.
2. Isi: *Password Lama*, *Password Baru*, *Konfirmasi*.
3. Setelah berhasil, sistem otomatis logout — login kembali dengan password baru.

---

## 9. Pesan dari Administrator

Administrator dapat mengirim pesan langsung kepada pengguna. Pesan muncul otomatis di bagian atas dashboard.

| Aksi | Cara Melakukan |
|---|---|
| Melihat Pesan | Pesan muncul otomatis; badge biru = jumlah belum dibaca |
| Tandai Sudah Dibaca | Klik tombol **"Tandai dibaca"** |
| Hapus Pesan | Klik tombol **"Oke"** |

> ✅ Pesan diperbarui otomatis setiap **30 detik**. Tidak perlu refresh manual.

---

## 10. Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Status Perangkat: Offline | Tidak ada data baru > 60 detik | Periksa koneksi ESP32 di lapangan, cek SIM card |
| Nilai pH tidak berubah | Perangkat offline / sensor bermasalah | Cek status perangkat, hubungi teknisi jika offline |
| Pompa tidak merespons | Koneksi internet terputus | Refresh halaman, pastikan internet stabil |
| Login gagal terus | Nomor/password salah atau akun tidak aktif | Gunakan "Lupa Password" atau hubungi admin |
| OTP tidak diterima | Nomor tidak terdaftar / WhatsApp tidak aktif | Pastikan WhatsApp aktif, coba ulangi beberapa menit |
| Toggle pompa tidak bisa diklik | Cooldown 2 detik / sedang diproses | Tunggu beberapa detik lalu coba kembali |

---

> 📞 **Butuh Bantuan?**  
> Hubungi tim **KKN Margolestari T31** melalui administrator sistem atau penanggung jawab teknis di lapangan.

---

*Panduan ini berlaku untuk versi web TEGASU terkini.*
