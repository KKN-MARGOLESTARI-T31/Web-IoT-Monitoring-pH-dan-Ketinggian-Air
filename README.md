# 🌾 TEGASU — Web IoT Monitoring pH & Ketinggian Air

Sistem monitoring IoT berbasis web untuk memantau kondisi lahan pertanian dan kolam ikan secara real-time. Dibangun dengan **Next.js**, terhubung ke perangkat **ESP32** melalui HTTP polling.

---

## 📋 Daftar Fitur

### 1. 🔐 Autentikasi & Akun

| Fitur | Keterangan |
|---|---|
| **Login** | Masuk menggunakan nomor telepon & password |
| **Registrasi** | Daftar akun baru (khusus pengguna biasa) |
| **Lupa Password** | Reset password melalui WhatsApp OTP |
| **Ubah Password** | Ganti password dari halaman Profil |
| **Auto-logout** | Pompa manual otomatis mati saat pengguna logout |

---

### 2. 📊 Dashboard Utama (Pengguna)

Halaman utama yang dapat diakses setelah login. Memuat data sensor secara real-time dengan polling setiap **5 detik**.

#### 🔋 Informasi Sistem
- **Status Baterai** — Menampilkan persentase baterai perangkat IoT dengan indikator warna (hijau/kuning/merah) dan ikon batang baterai visual.
- **Status Koneksi** — Menampilkan apakah perangkat ESP32 sedang **Online** atau **Offline**. Perangkat dinyatakan offline apabila tidak ada data selama lebih dari **60 detik**.
- **Kekuatan Sinyal (CSQ/RSSI)** — Menampilkan level sinyal jaringan perangkat dengan 6 tingkatan: *Sangat Baik, Baik, Cukup, Lemah, Sangat Lemah, Hampir Putus*.

#### 🧪 Monitoring pH
- **Nilai pH Real-time** — Menampilkan nilai pH air terkini dengan warna yang berubah dinamis sesuai tingkat keasaman/kebasaan (merah → oranye → kuning → hijau → biru).
- **Status Lahan Otomatis** — Sistem secara otomatis menganalisis pH dan menampilkan status serta rekomendasi tindakan untuk dua jenis lahan:
  - **🐟 Kolam Ikan**: pH optimal 6.5–8.5. Di luar rentang akan muncul peringatan beserta tindakan yang disarankan (kapur, ganti air, dll).
  - **🌾 Sawah Padi**: pH optimal 5.5–7.0. Di luar rentang akan muncul peringatan beserta saran (pengapuran, netralisasi, dll).

#### 💧 Ketinggian Air
- **Visualisasi Level Air** — Menampilkan ketinggian air secara visual menggunakan komponen animasi (`WaterLevelMeter`) dalam satuan cm.

#### ⚙️ Kontrol Pompa Air
- **Toggle Pompa** — Menghidupkan/mematikan pompa irigasi melalui toggle switch.
- **Mode Timer** — Saat pompa dinyalakan, pengguna memilih durasi (menit/jam/hari). Pompa otomatis mati setelah waktu habis.
- **Mode Manual** — Pompa menyala tanpa batas waktu sampai dimatikan secara manual.
- **Countdown Timer** — Menampilkan sisa waktu pompa aktif dalam format `HH:MM:SS`.
- **Sinkronisasi Multi-User** — Status pompa disinkronkan ke semua pengguna yang login setiap 5 detik melalui polling database.
- **Cooldown 2 Detik** — Mencegah toggle pompa berulang dengan cepat.

#### 💬 Pesan dari Administrator
- Menampilkan pesan yang dikirim oleh admin ke pengguna.
- Pengguna dapat menandai pesan sebagai **Sudah Dibaca** atau **Menghapus** pesan.
- Indikator jumlah pesan belum dibaca ditampilkan di badge.

---

### 3. 👤 Halaman Profil

- **Informasi Akun** — Menampilkan nama pengguna dan nomor telepon.
- **Ubah Sandi** — Dialog untuk mengganti password dengan validasi:
  - Semua kolom wajib diisi
  - Password baru minimal 6 karakter
  - Konfirmasi password harus cocok
- **Riwayat Pompa** — Modal popup berisi daftar 20 aktivasi/nonaktivasi pompa terakhir, lengkap dengan waktu, status (ON/OFF), perubahan status, dan siapa yang mengubahnya.
- **Riwayat pH** — Modal popup berisi grafik area interaktif perubahan pH.
- **Logout** — Keluar dari akun.

---

### 4. 📈 Grafik Riwayat pH

Komponen grafik interaktif yang dapat diakses dari halaman **Profil** dan **Admin Dashboard**.

- **Filter Periode** — Pilih rentang waktu: **Jam / Hari / Bulan / Tahun**.
- **Grafik Area Interaktif** — Menampilkan rata-rata pH per periode dengan animasi.
- **Tooltip Detail** — Hover/tap pada titik data untuk melihat nilai rata-rata pH secara presisi.
- **Scroll Horizontal** — Grafik dapat digeser ke kiri/kanan untuk melihat semua data.

---

### 5. 🛠️ Admin Dashboard

Hanya dapat diakses oleh akun dengan role **admin**. Memiliki 3 tab utama:

#### Tab Sistem
Tampilan lengkap semua data sensor (Baterai, Status Perangkat, Sinyal CSQ, pH, Level Air, Kolam Ikan, Sawah Padi) serupa dashboard pengguna, dengan tampilan yang lebih luas (3 kolom).

#### Tab Monitoring
- **Grafik Riwayat pH** (`PHHistoryGraph`) — Grafik perubahan pH dengan filter periode.
- **Riwayat Pompa** — Tabel 20 aktivitas pompa terakhir.
- **Kontrol Pompa** — Toggle pompa dengan mode timer dan manual, identik dengan dashboard pengguna.

#### Tab Pengguna
- **Daftar Pengguna** — Menampilkan semua user terdaftar (nama, email, status aktif, tanggal daftar).
- **Tambah Pengguna** — Form untuk menambah akun pengguna baru (username, email, password).
- **Hapus Pengguna** — Menghapus akun pengguna dengan konfirmasi dialog. Data dihapus permanen dari database.
- **Kirim Pesan ke Pengguna** — Modal untuk mengirim pesan teks yang akan muncul di dashboard pengguna.

#### Fitur Tambahan Admin
- **Ubah Password Admin** — Tombol di header tab untuk mengganti password admin. Setelah berhasil, sistem otomatis logout.
- **Auto-OFF Pompa** — Pompa mode manual otomatis mati saat admin logout atau menutup halaman.

---

### 6. 🔌 Integrasi ESP32 (IoT)

- **HTTP Polling** — ESP32 mengirim data sensor (pH, level air, baterai, kekuatan sinyal) ke endpoint `/api/water-level` dan `/api/ph` secara berkala.
- **API Key Authentication** — Setiap request dari ESP32 harus menyertakan `X-API-Key` di header untuk keamanan.
- **Status Device** — Endpoint `/api/device-status` memantau kapan terakhir kali data dikirim untuk mendeteksi perangkat offline.
- **Kontrol Relay Pompa** — ESP32 membaca status pompa dari `/api/pump-relay` dan mengaktifkan/menonaktifkan relay sesuai perintah dari web.

---

### 7. 🛡️ Keamanan & Middleware

- **Session-based Auth** — Menggunakan **NextAuth.js** untuk manajemen sesi login.
- **Route Protection** — Middleware otomatis mengarahkan pengguna yang belum login ke halaman `/login`, dan mencegah akses `/admin` untuk non-admin.
- **Role-based Access** — Admin dan pengguna biasa memiliki akses halaman yang berbeda.

---

## 🗺️ Peta Halaman

```
/login          → Halaman Login
/signup         → Halaman Registrasi
/forgot-password → Halaman Lupa Password / Reset Password
/               → Dashboard Utama (pengguna login)
/profile        → Profil Pengguna
/admin          → Admin Dashboard (khusus admin)
```

---

## 🧰 Teknologi

- **Frontend**: Next.js 15 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: NextAuth.js
- **IoT Device**: ESP32 (HTTP)
- **Notifikasi**: WhatsApp (via Fonnte API)
- **Chart**: Recharts
