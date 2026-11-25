# MUSE2API

> **Catatan:** Ini adalah fork terjemahan Bahasa Indonesia dari [https://github.com/czg86389-hub/muse2api](https://github.com/czg86389-hub/muse2api). Kode, logika, dan fungsionalitas tidak diubah; hanya teks dokumentasi yang diterjemahkan ke Bahasa Indonesia.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue?logo=python" alt="Python Version" />
  <img src="https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/API-OpenAI%20Compatible-green" alt="OpenAI API Compatible" />
  <img src="https://img.shields.io/badge/License-MIT-orange" alt="License" />
</p>

Membungkus kemampuan multimodal terdepan dari situs web **[muse.ai](https://muse.ai/)** hasil reverse engineering menjadi **RESTful API** standar yang **kompatibel dengan OpenAI**. Melalui penembusan protokol CDP browser headless, penggunaan ulang terowongan WebSocket hot standby, dan manajemen Session dinamis, layanan ini secara native mendukung percakapan teks (respons kata pertama streaming dalam 2–3 detik), text-to-image, image-to-image editing, text-to-video, dan image-to-video dari frame pertama, serta menyediakan rotasi afinitas kolam multi-akun, perpanjangan sesi otomatis 48 jam dan keep-alive wake-up VM cloud, beserta ekstensi Chrome sekali klik untuk mengimpor akun.

---

## 🎬 Direkomendasikan: COOL AI — Studio AI video & gambar serba bisa untuk e-commerce

Upload satu foto produk, dan Anda bisa membuat video sales dengan presenter berbicara, drama pendek bermuatan produk, dan satu set lengkap gambar halaman detail e-commerce.

- **Video sales presenter**: skrip, storyboard, dan dialog ditulis otomatis, video presenter asli dibuat sekali klik
- **Video drama produk**: drama pendek twist, drama dialog, dan penempatan produk dalam cerita, dengan penulisan skrip, storyboard, dan produksi otomatis
- **Gambar detail e-commerce**: satu foto latar putih, sekali klik menghasilkan gambar utama, gambar suasana, gambar keunggulan, gambar detail, dan gambar perbandingan
- **Alat AI gambar & lainnya**: retouch produk, GIF animasi, manusia digital, penghapus subtitle, peningkatan kualitas gambar

👉 Coba sekarang: [www.coolai.mov](https://www.coolai.mov/?utm_source=github&utm_medium=readme&utm_campaign=muse2api)

### 🎬 Direkomendasikan: COOL AI — Studio AI video & gambar untuk e-commerce

Upload satu foto produk dan dapatkan video sales dengan presenter berbicara, video iklan bergaya cerita, dan satu set lengkap gambar halaman detail produk.

- **Video sales presenter**: skrip, pengambilan gambar, dan dialog ditulis untuk Anda, dibuat sekali klik
- **Iklan cerita**: video pendek twist, dialog, dan penempatan produk, ditulis skrip dan storyboard-nya secara otomatis
- **Gambar detail produk**: gambar utama, gambar gaya hidup, gambar keunggulan, gambar detail, dan gambar perbandingan dari satu foto berlatar putih
- **Alat lainnya**: retouch produk, animasi GIF, manusia digital, penghapus subtitle, upscaling

👉 Coba di sini: [www.coolai.mov](https://www.coolai.mov/?utm_source=github&utm_medium=readme&utm_campaign=muse2api)


---


## Catatan Peningkatan v1.6.12

- **Gambar yang dihasilkan kembali berukuran asli (#62)**: sejak 2026-11-19, muse.ai di chat hanya menampilkan thumbnail sekitar 498px; gambar asli baru dimuat saat penampil gambar dibuka. Tugas gambar kini otomatis membuka penampil untuk mengambil gambar asli (teruji 1344x1792); jika gagal diambil, tetap mengembalikan thumbnail dan menulis satu petunjuk di log layanan. Cukup perbarui layanan, ekstensi tidak perlu diperbarui.

Gambar yang dihasilkan kini berukuran penuh lagi (#62): tugas gambar membuka penampil gambar muse.ai untuk mengambil gambar asli, bukan thumbnail chat sekitar 498px. Perbarui layanan saja; ekstensi tidak berubah.


## Catatan Peningkatan v1.6.11

- **Ekstensi harus diperbarui manual ke 1.0.3**: perbarui layanan dulu, unduh paket ekstensi instance ini dari halaman admin, ganti direktori ekstensi lama, lalu muat ulang di halaman manajemen ekstensi browser; setiap profil browser diperbarui terpisah. Saat memakai mode Incognito/InPrivate, izinkan ekstensi berjalan di jendela incognito. Impor hanya berarti status login tersimpan, lanjutkan dengan menguji akun.
- **Pemeriksaan pembaruan tidak akan mengubah kode atau me-restart secara otomatis**: panel menampilkan versi terinstal yang sebenarnya dan status remote, admin mengonfirmasi pembaruan secara manual; jika ada tugas yang antre atau berjalan, pembaruan ditolak. Deployment berbasis image dapat mengatur MUSE2API_MANAGED_DEPLOYMENT=1, lalu memperbarui dengan membangun ulang image.
- **Antrean dan pembuatan dihitung waktunya secara terpisah**: halaman admin dapat mengatur batas antrean tersendiri, default 3600 detik, 0 berarti tanpa batas; tugas gambar yang lama tetap disarankan memakai interface tugas asinkron.
- **Pustaka video memakai thumbnail**: deployment dari source perlu menginstal FFmpeg; pengguna Docker harap membangun ulang image. Hanya memperbarui source Python tidak akan menginstal dependensi sistem di container lama.

Ekstensi 1.0.3 memerlukan reload manual di setiap profil browser. Pemeriksaan pembaruan bersifat read-only; konfirmasi pembaruan secara eksplisit. Bangun ulang image Docker untuk dukungan thumbnail FFmpeg.


## 🌟 Fitur Inti

- 💬 **Interface percakapan standar (Chat Completions & Responses API)**
  - Sepenuhnya kompatibel dengan protokol standar `/v1/chat/completions` dan `/v1/responses` versi baru yang dipakai default oleh Codex.
  - Mendukung native output mesin ketik streaming SSE (`stream=True`) dan pengembalian lengkap secara sinkron, dengan penggunaan ulang afinitas hot tab dan terowongan Noise WebSocket bawaan, **latensi kata pertama pada percakapan beruntun hanya 2–3 detik**.
  - Mendukung konteks percakapan multi-turn dan pengaturan System Prompt.
  - Pemetaan alias model cerdas bawaan, nama model umum seperti `gpt-4o`, `gpt-5`, `claude-sonnet-4`, `deepseek-chat` otomatis dirutekan.
- 🎨 **Pembuatan & pengeditan gambar berkualitas tinggi (Images Generations & Edits)**
  - Sepenuhnya kompatibel dengan interface `/v1/images/generations` (text-to-image) dan `/v1/images/edits` (image-to-image / pengeditan dengan gambar referensi).
  - Mendukung pembuatan berbagai rasio aspek seperti `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, mendukung unggah langsung satu atau banyak gambar referensi serta output bersih tanpa watermark.
  - Mendukung dua format pengembalian, `url` tautan langsung atau `b64_json`, dengan deteksi cepat penolakan teks murni dalam hitungan detik, sehingga antrean tidak deadlock.
  - Image-to-image hanya mengembalikan media baru yang dibuat kali ini: pratinjau unggahan dan lampiran riwayat dikecualikan, unduhan terikat pada hasil yang dipilih; jika unggahan gambar referensi atau pengiriman prompt tidak terkonfirmasi, error ditampilkan secara eksplisit, tidak lagi diam-diam mengembalikan gambar asli.
- 🎬 **Text-to-video / image-to-video (Videos)**
  - Terhubung native ke model pembuatan video kelas atas Muse, dapat meneruskan permintaan durasi 5 detik / 6 detik / 8 detik / 10 detik (durasi film jadi mengikuti output upstream Muse) serta pembuatan video vertikal `9:16` / horizontal `16:9`.
  - Mendukung unggah satu gambar referensi frame pertama, atau mengunggah banyak gambar referensi konten dan gaya melalui array `images`; pada mode multi-gambar, gambar pertama dipakai sebagai gambar awal utama.
  - Arsitektur tugas asinkron (membuat tugas via `/v1/videos` + polling status via `/v1/videos/{task_id}`).
  - Layanan sumber daya media bawaan `/v1/media/{filename}`, otomatis menyimpan persisten sumber daya MP4 / WebP yang dihasilkan.
- ⚡ **Eksekusi paralel multi-akun sesungguhnya (Multi-Account Parallel Execution)**
  - Berbasis container isolasi incognito native Chromium `Target.createBrowserContext`, banyak tugas berjalan bersamaan di sandbox independen.
  - Banyak akun membuat gambar, membuat video, dan percakapan streaming secara bersamaan tanpa saling memblokir, Cookie dan Session 100% terisolasi dan tidak akan tertukar.
  - Penjadwal konflik akun cerdas bawaan, satu akun yang sama otomatis saling mengunci untuk mencegah benturan, banyak akun otomatis berjalan paralel hingga penuh.
  - Batas konkurensi dapat dinaikkan sesuai performa mesin melalui `MUSE2API_CONCURRENCY` (default 2 konkurensi).
- 🔄 **Kolam multi-akun & penjadwalan afinitas koneksi panas**
  - Mendukung impor matriks akun Muse tanpa batas jumlah.
  - Distribusi cerdas berbasis afinitas koneksi panas (Warm-Tab Affinity) dan strategi LRU, menyeimbangkan respons super cepat 2 detik dengan konsumsi yang merata antar banyak akun.
  - Saat satu akun kehabisan kuota atau sesinya bermasalah, akun tersebut otomatis ditandai dan failover tanpa terasa dalam 0 detik ke akun cadangan yang sehat.
- 🛡️ **Deteksi status sesi & keep-alive VM cloud**
  - Proses latar belakang meminta `/api/session` untuk memeriksa sesi, dan memanggil `/api/hatch/vm/wake` seperlunya untuk membangunkan workspace; setelah proxy akun dikonfigurasi, permintaan ini memakai egress yang sama dengan browser.
  - Hanya menyimpan Cookie dan waktu kedaluwarsa yang benar-benar dikembalikan upstream, tidak akan menambah masa berlaku secara fiktif hanya karena pemeriksaan berhasil. Jika upstream tidak memperpanjang, sesi dicabut, atau akun dibatasi, tetap perlu mengonfirmasi di situs resmi dan mengimpor ulang.
- 🌐 **Proxy HTTP / SOCKS5 independen per akun**
  - Setiap akun dapat dikonfigurasi proxy HTTP atau SOCKS5 yang berbeda beserta info autentikasinya, dan konteks browser maupun permintaan sesi pada tugas bersamaan diisolasi per akun; kegagalan proxy tidak akan diam-diam kembali ke koneksi langsung.
- 🧩 **Ekstensi Chrome sekali klik untuk impor akun**
  - Tanpa perlu mengambil Cookie manual lewat F12, sekali klik ikon ekstensi langsung mengekstrak status login browser saat ini (termasuk Cookie inti `HttpOnly` dan waktu kedaluwarsa sebenarnya) lalu mendorongnya dengan aman ke kolam akun.
- 🖥️ **Panel operasional modern bertema gelap (Web Console) & upgrade panas online real-time**
  - Web UI bawaan yang siap pakai, mendukung pemantauan real-time kesehatan layanan, kuota dan status kolam akun, keep-alive seluruh kolam sekali klik, pemutaran ulang progres tugas, manajemen pustaka media, dan debugging interface online.
  - Daftar video di pustaka media hanya me-load thumbnail JPEG secara lazy, video baru dimuat saat sampul diklik atau tombol "Buka" ditekan, dan player dilepas saat pratinjau ditutup. Thumbnail dibuat on-demand oleh FFmpeg, di-cache di `data/thumbnails/`, dan dibersihkan bersamaan saat media dihapus; video lama tidak perlu dibuat ulang. Image Docker sudah berisi FFmpeg, deployment manual perlu menginstal `ffmpeg`; jika dependensi tidak ada atau video rusak, placeholder pemutar ditampilkan, tanpa fallback memuat video asli.
  - **Siaran pembaruan real-time seluruh node & upgrade sekali klik**: saat repositori GitHub resmi merilis versi baru atau perbaikan, bagian atas halaman admin semua node yang sudah di-deploy otomatis menampilkan banner notifikasi pembaruan, klik **"⚡ Upgrade Online & Restart Sekali Klik"** untuk otomatis menarik kode terbaru dan me-restart dengan mulus (konfigurasi `.env` lokal dan data akun otomatis dipertahankan).

---

## 🚀 Deployment Cepat

### Cara 1: Docker Compose (direkomendasikan, sekali perintah langsung jalan)

1. **Clone kode dan masuk ke direktori**:
   ```bash
   git clone https://github.com/czg86389-hub/muse2api.git
   cd muse2api
   ```

2. **Konfigurasi variabel environment (opsional)**:
   ```bash
   cp .env.example .env
   # Edit .env sesuai kebutuhan, disarankan mengubah MUSE2API_KEY menjadi kunci admin Anda sendiri
   ```

   Docker Compose akan membaca `MUSE2API_KEY` dari `.env`, dan tidak akan ditimpa lagi oleh nilai contoh di file Compose.

3. **Jalankan container**:
   ```bash
   docker compose up -d
   ```

4. **Buka panel admin**:
   Buka browser dan kunjungi: `http://<IP-server-Anda>:18610/admin?key=<MUSE2API_KEY-Anda>`

---

### Cara 2: Deployment bare metal / VPS (Ubuntu / Debian)

1. **Instal dependensi sistem & Chromium**:
   ```bash
   sudo apt-get update
   sudo apt-get install -y chromium ffmpeg fonts-wqy-zenhei python3 python3-pip python3-venv
   ```

2. **Konfigurasi virtual environment Python**:
   ```bash
   cd /opt/muse2api
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Konfigurasi layanan systemd**:
   ```bash
   sudo cp deploy/muse2api.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now muse2api
   ```

4. **Konfigurasi reverse proxy Nginx (penting: mencegah timeout 502 & streaming tersendat)**:
   Jika memakai reverse proxy Nginx / Baota / 1Panel, pastikan menaikkan `proxy_read_timeout` ke `600s` dan mematikan `proxy_buffering` (lihat detail di `deploy/nginx.example.conf`):
   ```nginx
   location / {
       proxy_pass http://127.0.0.1:18610;
       proxy_read_timeout 600s;      # Mencegah Nginx mengembalikan 502 Bad Gateway karena pembuatan gambar/video yang lama
       proxy_send_timeout 600s;
       proxy_buffering off;          # Menjamin streaming mesin ketik SSE percakapan keluar tanpa jeda
       client_max_body_size 200M;    # Mendukung unggah materi referensi besar seperti video/audio
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
   ```

---

## 🧩 Impor Akun (Ekstensi Chrome / Skrip Tampermonkey)

> **Pengguna v1.6.6 wajib memperbarui plugin secara manual: ekstensi Chrome/Edge minimal 1.0.2, skrip Tampermonkey minimal 1.1.2.**
> Pembaruan server tidak otomatis mengganti ekstensi yang sudah dimuat. Unduh ZIP Release ini, timpa file di direktori ekstensi lama, lalu klik "Muat ulang" di chrome://extensions / edge://extensions; setiap profil browser diperbarui terpisah. Judul popup seharusnya menampilkan **v1.0.2**.
> [Unduh ekstensi 1.0.2](https://github.com/czg86389-hub/muse2api/releases/download/v1.6.6/muse2api-chrome-extension-v1.6.6.zip). Hanya hatch_sess yang wajib untuk impor; hatch_vml dan hatch_gw yang tidak ada tidak bisa dipakai untuk menyimpulkan belum login. Setelah impor ulang, klik "Tes" pada akun.
>
> **Pembaruan ekstensi manual wajib:** ekstensi 1.0.2+ / userscript 1.1.2+. Pembaruan server tidak meng-upgrade ekstensi yang dimuat dari folder. Ganti file di folder lama dan klik Reload, terpisah untuk setiap profil browser.


### Cara A: Ekstensi Chrome / Edge
Proyek ini menyertakan ekstensi Chrome khusus untuk impor akun (direktori `extension/`), sehingga tidak perlu lagi mengekstrak Cookie manual lewat F12:

1. Buka browser Chrome / Edge, kunjungi `chrome://extensions`, nyalakan **"Mode pengembang"** di kanan atas.
2. Klik **"Muat ekstensi yang belum dipaketkan"**, pilih direktori `extension` di proyek ini.
3. Di browser tersebut, login ke [muse.ai](https://muse.ai/) sampai masuk ke antarmuka chat utama.
4. Klik ikon plugin di kanan atas browser, isi alamat layanan Anda (misalnya `http://1.2.3.4:18610`) dan `MUSE2API_KEY`.
5. Klik **"Baca & Impor"**, sinkronisasi ke database dalam hitungan detik!

### Cara B: Skrip Tampermonkey (lintas browser, tanpa instal ekstensi)
Bagi pengguna yang tidak ingin mengaktifkan mode pengembang atau memakai Firefox / Safari, disarankan memakai skrip Tampermonkey yang bisa diinstal sekali klik:

👉 **[⚡ Klik untuk instal skrip Tampermonkey sekali klik (Raw UserJS)](https://raw.githubusercontent.com/czg86389-hub/muse2api/main/tools/muse2api_cookie_importer.user.js)**

1. Instal plugin [Tampermonkey](https://www.tampermonkey.net/) di browser.
2. Klik tautan **"⚡ Klik untuk instal skrip Tampermonkey"** di atas, Tampermonkey akan otomatis menampilkan jendela instalasi, klik "Instal" (tidak perlu menyalin-tempel kode secara manual).
3. Buka halaman web [muse.ai](https://muse.ai/), ikon mengambang **"⚡"** akan muncul di kanan bawah, klik untuk membuka panel konfigurasi dan mendorong sekali klik ke database (juga mendukung fallback salin otomatis ke clipboard).

---

## 📖 Contoh Pemanggilan API

### Proxy independen per akun / Per-account proxy

Di kolam akun, klik **Proxy** di samping akun:

1. Pilih **Gunakan proxy / Use a proxy**, lalu tempel tautan lengkap secara langsung, misalnya `socks5://your-user:your-password@proxy.example.com:1080`. Nama pengguna dan kata sandi akan diurai otomatis; Anda juga bisa membuka kolom autentikasi manual opsional untuk mengisinya terpisah.
2. Segera klik **Tes konektivitas / Test connection**, tanpa perlu menyimpan atau membuka ulang jendela. Hasil menampilkan masing-masing konektivitas proxy, IP egress, dan status sesi Muse; menguji konfigurasi berbeda yang belum disimpan tidak akan mengubah proxy tersimpan, status kesehatan, maupun catatan deteksi proxy akun. Setelah yakin, klik **Simpan / Save**, berlaku pada permintaan berikutnya.
3. Lanjutkan memakai tombol **Tes / Test** pada akun untuk memastikan browser dapat memuat kotak input chat. Verifikasi sesi yang berhasil tidak menjamin upstream pasti mengizinkan pembuatan gambar atau video tertentu.

Mendukung endpoint proxy HTTP (opsional autentikasi Basic) dan endpoint proxy SOCKS5 (opsional autentikasi nama pengguna/kata sandi), misalnya `http://proxy.example.com:8080`, `socks5://proxy.example.com:1080`, atau `socks5h://proxy.example.com:1080`. Nama host target pada SOCKS5 di-resolve lewat proxy; situs HTTPS tetap didukung. **Endpoint proxy HTTPS, VLESS, VMess, dan tautan subscription belum didukung untuk diisi langsung**; saat memakai alat seperti Clash/Mihomo, isi entry proxy HTTP atau SOCKS5 yang dapat diakses server deployment. `127.0.0.1:7890` mengacu pada server deployment itu sendiri, bukan komputer tempat Cookie diimpor. Akun lama tanpa proxy yang dikonfigurasi tetap memakai perilaku jaringan lama.

Percakapan, pembuatan gambar, pembuatan video, unduhan browser, deteksi akun, query kuota, perpanjangan sesi, dan wake-up VM memakai proxy akun. Proxy terputus, autentikasi gagal, atau pembuatan konteks browser gagal akan dilaporkan sebagai error, **tidak akan diam-diam kembali ke koneksi langsung**. Pergantian akun sekaligus mengganti proxy. Gambar referensi eksternal di-prefetch sebelum akun dipilih sesuai kebijakan keamanan yang ada, tetap menjalankan perlindungan alamat publik, redirect, dan DNS rebinding, dan tidak menjanjikan semua URL gambar referensi lolos lewat proxy akun.

Mengubah proxy saat akun sedang sibuk akan mengembalikan HTTP 409, tunggu sampai tugas berjalan selesai. Setelah diubah, permintaan berikutnya akan membuat ulang koneksi, tidak memakai node lama. Konektivitas proxy dan sesi akun adalah status yang berbeda: HTTP 407 dan timeout koneksi tidak langsung menandai Cookie sebagai tidak valid; pengujian proxy juga tidak menimpa hasil autentikasi akun yang sudah ada.

Info autentikasi di tautan lengkap lebih diutamakan daripada kolom autentikasi manual; karakter khusus seperti `@`, `#`, `/` pada nama pengguna atau kata sandi harus memakai URL percent-encoding. Setelah disimpan, alamat dinormalisasi ke bentuk tanpa info autentikasi, dan kata sandi tidak ditampilkan kembali saat dibuka ulang.

Kata sandi proxy disimpan bersama Cookie di `data/accounts.json` pada mesin ini, lindungi direktori ini beserta backup-nya. Interface, log, dan halaman tidak menampilkan kata sandi. Saat mengubah, jika alamat dan nama pengguna tidak berubah, kata sandi yang dikosongkan berarti dipertahankan; jika alamat atau nama pengguna berubah, kata sandi autentikasi harus dimasukkan ulang. Pilih **Jaringan default / Default network** atau **Hapus proxy / Remove proxy** untuk menghapus konfigurasi dan kembali ke jaringan default.

Contoh API admin (perlu autentikasi):

```http
PATCH /admin/accounts/{account_id}
Content-Type: application/json
Authorization: Bearer <MUSE2API_KEY>

{
  "proxy": {
    "server": "http://proxy.example.com:8080",
    "username": "your-proxy-user",
    "password": "your-proxy-password"
  }
}
```

Menghilangkan `proxy` berarti tidak mengubah pengaturan; mengirim `{"proxy": null}` berarti menghapus proxy. `POST /admin/accounts` juga menerima objek `proxy` yang sama, termasuk mengatur proxy yang sama untuk impor massal kali ini. Respons hanya berisi server, nama pengguna, dan `has_password`, tanpa mengembalikan kata sandi.

```http
POST /admin/accounts/{account_id}/proxy/test
Authorization: Bearer <MUSE2API_KEY>
```

Tanpa request body, pengujian memakai proxy yang sudah tersimpan. Untuk menguji proxy yang belum disimpan, kirim `Content-Type: application/json` dan `{"proxy":{"server":"socks5://your-user:your-password@proxy.example.com:1080"}}`; kolom `server` juga mendukung tautan lengkap HTTP/SOCKS5h, dan autentikasi kolom terpisah versi lama tetap kompatibel. Respons `tested_saved_proxy=false` berarti isi yang diuji berbeda dari proxy yang tersimpan saat ini, dan isi tersimpan akun tidak berubah; jika `true`, catatan deteksi proxy saat ini akan diperbarui.

Setelah upgrade dari 1.6.8, akun yang sebelumnya belum menyimpan hasil deteksi perlu mengklik "Tes konektivitas" sekali lagi. Catatan kosong akan menampilkan "Proxy belum dites", dan baru menampilkan "Proxy sudah terhubung" atau "Proxy tidak lolos" setelah deteksi nyata selesai, tanpa otomatis menandai status yang belum diketahui sebagai berhasil.

Saat menguji sebelum menyimpan, server dapat memakai kembali catatan hasil tes nyata dalam 5 menit terakhir di proses yang sama; harus akun yang sama, node yang sama beserta autentikasi, dan Cookie login yang sama. Setelah konfigurasi diubah, Cookie diganti, kedaluwarsa, atau layanan di-restart, hasil sukses lama tidak dipakai lagi. Hanya hasil nyata yang dipakai ulang, hasil tes yang gagal tidak akan diubah menjadi berhasil; hal ini bukan berarti browser akun atau kemampuan pembuatannya sudah terverifikasi.

Pengujian ini mengakses deteksi egress HTTPS tanpa Cookie lewat proxy yang dipilih, lalu memverifikasi sesi Muse; `proxy_reachable`, `exit_ip`, `session_ok`, dan `workspace_status` yang dikembalikan masing-masing menyatakan hasil tiap lapisan. Jika tidak ada konfigurasi sementara maupun proxy tersimpan, dikembalikan 400; jika akun sedang sibuk, dikembalikan 409. Operasi ini tidak membuat konten, dan tidak mengonsumsi kuota pembuatan gambar/video.

**English:** Setiap akun dapat memakai proxy HTTP sendiri dengan autentikasi Basic opsional, atau proxy SOCKS5 dengan autentikasi nama pengguna/kata sandi opsional. Pilih **Use a proxy**, tempel URL lengkap seperti `socks5://your-user:your-password@proxy.example.com:1080`, lalu klik **Test connection** segera. Menyimpan dan membuka ulang tidak diperlukan. Pengujian rute berbeda yang belum disimpan tidak mengubah rute tersimpan, kesehatan akun, maupun status tes yang tersimpan. Menguji konfigurasi tersimpan yang persis sama akan memperbarui catatan konektivitasnya; klik **Save** secara terpisah untuk menerapkan rute. Kolom kredensial manual tetap opsional. Kredensial di URL lebih diutamakan; encode karakter khusus dengan percent-encoding. Origin proxy `socks5://` maupun `socks5h://` diterima, dan nama host target di-resolve oleh proxy. Situs HTTPS didukung; endpoint proxy HTTPS, VLESS/VMess, dan URL subscription tidak didukung langsung. Alamat proxy harus dapat dijangkau dari server deployment. Kegagalan proxy tidak pernah kembali ke akses langsung. Akun yang tidak dikonfigurasi tetap memakai perilaku jaringan lama. Akun yang sedang aktif tidak bisa mengubah proxy (HTTP 409); permintaan berikutnya membuat ulang konteks setelah perubahan tersimpan. Kosongkan kata sandi hanya untuk mempertahankannya saat server dan nama pengguna tidak berubah. Respons API maupun log tidak mengekspos kata sandi. Menyimpan konfigurasi yang persis sama dapat memakai hasil observasi server dari lima menit terakhir dalam proses yang sama, terikat pada akun, rute, kredensial, dan cookie. Input yang diubah/kedaluwarsa tidak pernah mewarisi sukses, dan hasil gagal tetap gagal. API pengujian menerima body opsional `{"proxy":{"server":"socks5://your-user:your-password@proxy.example.com:1080"}}` untuk tes draf; body kosong tetap menguji proxy tersimpan. Tes proxy melaporkan konektivitas, IP egress, dan status sesi Muse secara terpisah; tes ini tidak membuktikan kemampuan pembuatan maupun menggantikan tes browser akun.

---

Semua interface yang dilindungi wajib membawa di Header:
```http
Authorization: Bearer <MUSE2API_KEY-Anda>
```

### 1. Penyelesaian Percakapan (Chat Completions)

```bash
curl -X POST "http://localhost:18610/v1/chat/completions" \
  -H "Authorization: Bearer m2a_your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "muse-spark",
    "messages": [
      {"role": "user", "content": "Tulis sebuah puisi tujuh kata tentang cyberpunk dan hujan neon di malam hari"}
    ],
    "stream": false
  }'
```

### 2. Pembuatan Gambar (Image Generation)

```bash
curl -X POST "http://localhost:18610/v1/images/generations" \
  -H "Authorization: Bearer m2a_your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "muse-image",
    "prompt": "Seekor anjing Shiba robotik memakai baju antariksa anti-gravitasi, pencahayaan sinematik, resolusi 8k",
    "size": "16:9",
    "response_format": "url"
  }'
```

**Contoh respons**:
```json
{
  "created": 1790148495,
  "data": [
    {
      "revised_prompt": "Seekor anjing Shiba robotik memakai baju antariksa anti-gravitasi, pencahayaan sinematik, resolusi 8k",
      "url": "http://localhost:18610/v1/media/img_abc123.webp",
      "kind": "image",
      "bytes": 54210
    }
  ]
}
```

Penggunaan banyak gambar referensi memakai array `images` (maksimal 10 materi; masing-masing tidak lebih dari 40 MiB, total tidak lebih dari 100 MiB, lihat "Materi Referensi" di bawah); layanan akan mengunggah satu per satu sesuai urutan array, dan baru mengirim prompt setelah semua lampiran terkonfirmasi oleh halaman web. `images` tidak boleh dicampur dengan kolom gambar tunggal versi lama seperti `image` / `reference_image`:

```bash
curl -X POST "http://localhost:18610/v1/images/generations" \
  -H "Authorization: Bearer m2a_your_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "muse-image",
    "prompt": "Gabungkan subjek pada gambar pertama dengan palet warna gambar kedua untuk membuat poster",
    "images": [
      {"url": "https://example.com/subject.png"},
      {"url": "https://example.com/style.png"}
    ],
    "response_format": "url"
  }'
```

Permintaan multipart ke `/v1/images/edits` dapat mengirim berulang kolom `image` dengan nama yang sama:

```bash
curl -X POST "http://localhost:18610/v1/images/edits" \
  -H "Authorization: Bearer m2a_your_secret_key" \
  -F "prompt=Gabungkan dua gambar referensi menjadi satu gambar baru" \
  -F "image=@subject.png" \
  -F "image=@style.png"
```

### 3. Text-to-Video / Image-to-Video (Videos)

- **Langkah 1: Buat tugas pembuatan**
  ```bash
  curl -X POST "http://localhost:18610/v1/videos" \
    -H "Authorization: Bearer m2a_your_secret_key" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "Daun maple keemasan melayang ringan tertiup angin sepoi-sepoi, sinar matahari menembus sela pepohonan",
      "duration": 5,
      "size": "16:9"
    }'
  ```
  Mengembalikan ID tugas: `{"id": "task_xyz789", "status": "queued"}`

  Video dengan banyak gambar referensi memakai array `images` yang berurutan dalam satu permintaan yang sama; yang didukung di sini adalah banyak gambar sebagai referensi video, bukan mengunggah file video sebagai referensi:
  ```bash
  curl -X POST "http://localhost:18610/v1/videos" \
    -H "Authorization: Bearer m2a_your_secret_key" \
    -H "Content-Type: application/json" \
    -d '{
      "prompt": "Buat subjek pada gambar pertama bergerak dalam suasana dan palet warna gambar kedua",
      "images": [
        {"url": "https://example.com/start.png"},
        {"url": "https://example.com/style.png"}
      ],
      "duration": 6,
      "size": "16:9"
    }'
  ```

- **Langkah 2: Polling progres tugas**
  ```bash
  curl "http://localhost:18610/v1/videos/task_xyz789" \
    -H "Authorization: Bearer m2a_your_secret_key"
  ```
  Saat selesai, dikembalikan:
  ```json
  {
    "id": "task_xyz789",
    "status": "succeeded",
    "progress": 100,
    "result": {
      "url": "http://localhost:18610/v1/media/vid_xyz789.mp4"
    }
  }
  ```

---

## 🎞️ Materi Referensi: Gambar / Video / Audio / Dokumen

Pembuatan gambar, pengeditan gambar, tugas gambar, dan interface video semuanya dapat melampirkan materi referensi, dengan batasan yang sama seperti di situs web muse.ai:

| Item | Batasan |
|---|---|
| Jumlah | Maksimal 10 per permintaan (total semua kolom) |
| Ukuran per item | 40 MiB; total 100 MiB |
| Gambar | jpg / png / gif / webp / heic / heif / avif |
| Video | mp4 / mov / webm / 3gp, durasi tidak lebih dari 120 detik (mp4/mov divalidasi dulu) |
| Audio | mp3 / wav / m4a / ogg / flac / aac / opus |
| Dokumen | pdf / doc / docx |

- Kolom JSON: `images` (bisa mencampur materi apa pun), `videos`, `audios`, `files`, diunggah berurutan sesuai urutan ini; setiap item dapat berupa URL, Data URL, Base64, atau objek `{"url": ...}` / `{"video_url": ...}` / `{"audio_url": ...}`.
- Tipe diambil dari Data URL / header respons / deklarasi MIME multipart; jika deklarasi kosong atau `application/octet-stream`, dikenali dari file header.
- Multipart `/v1/images/edits` dapat mengirim berulang kolom `image`, `video`, `audio`, `file`.
- Untuk tugas video, jika materi pertama adalah gambar, gambar itu dipakai sebagai gambar awal utama; hasil jadi tidak akan pernah berupa materi yang diunggah kali ini (dikecualikan berdasarkan hash konten).

```bash
curl -X POST "http://localhost:18610/v1/videos"   -H "Authorization: Bearer m2a_your_secret_key"   -H "Content-Type: application/json"   -d '{
    "prompt": "Ikuti ritme pergerakan kamera pada video referensi, padukan dengan suasana audio, dan buat klip pemandangan kota di malam hari yang baru",
    "videos": [{"url": "https://example.com/ref.mp4"}],
    "audios": [{"url": "https://example.com/bgm.mp3"}],
    "duration": 8,
    "size": "16:9"
  }'
```

Reverse proxy Nginx perlu menaikkan `client_max_body_size` ke sekitar 200M, jika tidak materi berukuran besar akan ditolak 413.

---

## ⚙️ Daftar Konfigurasi Variabel Environment

| Nama Variabel | Nilai Default | Fungsi & Penjelasan |
|---|---|---|
| `MUSE2API_KEY` | Dibuat otomatis | Kunci autentikasi konsol admin & API (diawali `m2a_`) |
| `MUSE2API_HOST` | `127.0.0.1` | IP yang didengarkan (di dalam Docker disarankan `0.0.0.0`) |
| `MUSE2API_PORT` | `18610` | Port tempat layanan berjalan |
| `MUSE2API_PUBLIC_BASE` | `kosong` | Prefiks URL lengkap untuk publik, dikosongkan berarti frontend mendeteksi sumber akses secara otomatis |
| `MUSE2API_CHROMIUM` | `chromium` | Path lengkap executable browser |
| `MUSE2API_CDP_PORT` | `19210` | Port komunikasi debugging CDP internal |
| `MUSE2API_CONCURRENCY` | `2` | Jumlah maksimum tugas pembuatan bersamaan (dapat dinaikkan sesuai sumber daya server, default 2) |
| `MUSE2API_IMAGE_TIMEOUT` | `240` | Batas atas timeout pembuatan gambar (detik) |
| `MUSE2API_VIDEO_TIMEOUT` | `600` | Batas atas timeout pembuatan video (detik) |
| `MUSE2API_CHAT_TIMEOUT` | `300` | Batas atas timeout pembuatan percakapan (detik) |
| `MUSE2API_BUSY_RETRIES` | `3` | Jumlah percobaan ulang tambahan saat muse.ai membalas "layanan video/gambar overload, 503, sementara tidak tersedia" (0 = tidak mencoba ulang); penolakan pembuatan, wilayah tidak didukung, dan kuota tidak cukup tidak dicoba ulang |
| `MUSE2API_BUSY_RETRY_DELAY` | `20` | Jeda dalam detik sebelum percobaan ulang di atas |
| `MUSE2API_BUSY_RETRY_MIN_REMAINING` | `180` | Jika sisa batas waktu pembuatan kurang dari jumlah detik ini (ditambah waktu tunggu), tidak mencoba ulang lagi dan langsung mengembalikan kegagalan |
| `MUSE2API_VIDEO_HEDGE` | `1` | Jika muse.ai baru-baru ini membalas "overload/503", video dibuat bersamaan di 2 akun idle, yang selesai lebih dulu dipakai sebagai hasil, dan jalur satunya langsung dibatalkan; atur `0` untuk mematikan. Hanya memengaruhi video, dan memerlukan minimal 2 akun idle serta 1 slot konkurensi idle |
| `MUSE2API_VIDEO_HEDGE_WINDOW` | `1200` | Berapa detik setelah balasan overload terakhir mode paralel tetap dipertahankan (dipulihkan dari catatan tugas terbaru setelah restart) |
| `MUSE2API_VIDEO_HEDGE_LEASE_TIMEOUT` | `5` | Waktu tunggu maksimum jalur kedua untuk mendapatkan akun idle, dalam detik; jika tidak dapat, hanya satu jalur yang berjalan |
| `MUSE2API_REF_IMAGE_LOCAL_FILES` | `0` | Default melarang membaca path lokal server; hanya deployment satu pengguna tepercaya yang boleh mengatur `1` secara eksplisit untuk memulihkan |
| `MUSE2API_REF_IMAGE_PRIVATE_FETCH` | `0` | Default hanya mengizinkan URL publik, dan memeriksa DNS/redirect per hop, mengunci IP yang sudah diperiksa, serta tidak memakai proxy environment; atur `1` secara eksplisit untuk mengizinkan URL privat/lokal |

Kedua sakelar default-nya `0`: semua interface pembuatan gambar, pengeditan gambar, tugas gambar, dan video melarang path lokal server dan URL privat/lokal. Data URL, Base64 yang valid, dan URL publik tetap berfungsi normal. Hanya jika Anda sudah yakin pemanggil tepercaya dan benar-benar membutuhkan, atur `1` secara eksplisit untuk memulihkan kemampuan lama yang sesuai.
Penolakan kebijakan, kegagalan unduhan, serta MIME atau ukuran yang tidak sesuai semuanya mengembalikan HTTP 400 sebelum tugas dibuat, tanpa membuat tugas latar belakang yang baru gagal kemudian.

Pemeriksaan regresi keamanan gambar referensi (simulasi DNS dan HTTP, tanpa jaringan nyata atau akun):

```bash
python tests/test_ref_image_safety.py
```

---

## 🔒 Pernyataan Keamanan & Privasi

- **Nol kebocoran data**: semua data perangkat lunak ini (termasuk kredensial akun, antrean tugas, dan file media) disimpan persisten di direktori lokal `data/`, tanpa bergantung pada telemetri pihak ketiga atau layanan perantara eksternal apa pun.
- **Kepatuhan open source**: proyek ini hanya untuk pertukaran teknis, penelitian operasi otomatisasi sistem, dan pengujian otomatis. Jangan gunakan proyek ini untuk tujuan yang melanggar Ketentuan Layanan platform Meta atau peraturan perundang-undangan negara mana pun.

---

## 👥 Ucapan Terima Kasih kepada Kontributor (Contributors)

Terima kasih kepada para developer berikut atas kontribusi kode dan optimalisasi fitur untuk MUSE2API (diurutkan berdasarkan urutan PR yang digabungkan):

- 🌟 **[@cpt-kenvie](https://github.com/cpt-kenvie)** (PR [#2](https://github.com/czg86389-hub/muse2api/pull/2)) —— Memperbaiki pembacaan variabel environment `.env` oleh Docker Compose dan masalah penimpaan konfigurasi contoh
- 🌟 **[@djs-91](https://github.com/djs-91)** (PR [#9](https://github.com/czg86389-hub/muse2api/pull/9)) —— Memperbaiki anomali parsing alamat halaman admin akibat kolaps Base URL saat `MUSE2API_PUBLIC_BASE` tidak dikonfigurasi
- 🌟 **[@toby-bridges](https://github.com/toby-bridges)** (PR [#8](https://github.com/czg86389-hub/muse2api/pull/8)) —— Menyesuaikan UI Mandarin situs live muse.ai, memperbaiki konfirmasi unggah lampiran dan kesalahan penilaian status Stop, memperkuat perlindungan salah pilih hasil jadi video dan sampul
- 🌟 **[@LF2023](https://github.com/LF2023)** (PR [#18](https://github.com/czg86389-hub/muse2api/pull/18)) —— Memperbaiki pembuatan video yang hanya mengandalkan tid sehingga salah mengenai frame diam sampul, menstandarkan pencocokan yang diharapkan dan mekanisme anti-salah-pilih
- 🌟 **[@wuliaolaozi](https://github.com/wuliaolaozi)** (PR [#27](https://github.com/czg86389-hub/muse2api/pull/27)) —— Menyesuaikan query kuota Mandarin-Inggris, memperbaiki pembacaan kuota dan pesan error halaman admin
- 🌟 **[@CarloCPP](https://github.com/CarloCPP)** (PR [#6](https://github.com/czg86389-hub/muse2api/pull/6), [#26](https://github.com/czg86389-hub/muse2api/pull/26)) —— Menyumbangkan skrip Tampermonkey sekali klik untuk impor akun, melonggarkan validasi Cookie wajib ke kredensial session, dan instalasi sekali klik
- 🌟 **[@gr219](https://github.com/gr219)** (PR [#31](https://github.com/czg86389-hub/muse2api/pull/31)) —— Menyediakan dukungan pergantian dinamis dwibahasa Mandarin-Inggris (i18n) untuk halaman admin dan ekstensi Chrome
- 🌟 **[@Yeadon8888](https://github.com/Yeadon8888)** (PR [#32](https://github.com/czg86389-hub/muse2api/pull/32)) —— Menambahkan dukungan pembuatan gambar, pengeditan, dan image-to-video dengan banyak gambar referensi yang berurutan
- 🌟 **[@pandalaohe](https://github.com/pandalaohe)** (PR [#24](https://github.com/czg86389-hub/muse2api/pull/24)) —— Menyediakan kebijakan keamanan file lokal dan URL privat untuk gambar referensi, pemeriksaan ulang redirect, dan perlindungan DNS rebinding
- 🌟 **[@QuartzWarrior](https://github.com/QuartzWarrior)** (PR [#25](https://github.com/czg86389-hub/muse2api/pull/25)) —— Menyumbangkan fondasi proxy HTTP independen per akun, penerusan autentikasi, antarmuka konfigurasi, dan tes regresi isolasi
- [@Roins-hub](https://github.com/Roins-hub): Kompatibilitas area input Muse versi baru, materi referensi video/audio/dokumen (PR #40).

- [@WXJJ0520](https://github.com/WXJJ0520): Membatasi tombol kirim pada area input saat ini, memperbaiki kesalahan pencocokan riwayat sidebar, dan menambahkan regresi Chromium nyata (PR [#48](https://github.com/czg86389-hub/muse2api/pull/48)).

- [@Yeadon8888](https://github.com/Yeadon8888): Mempertahankan rotasi Cookie dalam respons sesi yang belum dialokasikan, agar tidak terus memakai nilai lama yang sudah tidak valid (PR [#60](https://github.com/czg86389-hub/muse2api/pull/60)).
- [@ALight777](https://github.com/ALight777): Isolasi penyimpanan Cookie jendela saat ini, anggaran antrean independen, pelaporan versi yang sebenarnya dan pemeriksaan pembaruan read-only, thumbnail video (PR [#58](https://github.com/czg86389-hub/muse2api/pull/58), [#55](https://github.com/czg86389-hub/muse2api/pull/55), [#57](https://github.com/czg86389-hub/muse2api/pull/57), [#51](https://github.com/czg86389-hub/muse2api/pull/51)).

Semua dipersilakan mengirim PR dan Issue, mari bersama-sama membuat proyek ini semakin kuat dan mudah dipakai!

---

## 📄 Lisensi Open Source

Proyek ini dirilis open source di bawah [MIT License](LICENSE).



## Tes Regresi Pemilihan Media

Memperbaiki masalah gambar referensi yang diunggah salah dinilai sebagai hasil pembuatan, dan proses unduhan yang tertimpa media lain di halaman.
Tes memakai profil Chromium sementara yang independen dan DOM sintetis lokal, tanpa mengakses Muse, tanpa membaca akun, dan tanpa mengonsumsi kuota pembuatan.
Setelah menginstal dependensi proyek dan Chromium, jalankan dari direktori root repositori:

```bash
python tests/test_media_selection.py
```

Jika browser tidak ada di PATH, atur `MUSE2API_CHROMIUM` ke path file executable.
Mencakup pengecualian pratinjau unggahan, deduplikasi hasil, pengecualian lampiran riwayat, unduhan dari sumber yang tepat, mempertahankan sumber video,
melarang fallback unduhan global, serta pembatalan saat pembacaan gambar referensi gagal. Efek akhir pengeditan gambar tetap harus diterima melalui interface nyata.


## v1.5.2: Pembuatan Gambar Lama di Balik Reverse Proxy/CDN

Interface gambar OpenAI sinkron tetap dipertahankan kompatibilitasnya, tetapi CDN/klien dapat memutus permintaan panjang sebelum pembuatan selesai.
Klien produksi sebaiknya memakai submit singkat + polling, bukan memperpanjang timeout HTTP lalu membuat ulang:

1. `POST /v1/images/tasks`: JSON sama seperti `/v1/images/generations`, dapat memakai `reference_image` untuk satu gambar referensi, atau array `images` untuk banyak gambar referensi; disarankan menambahkan header `Idempotency-Key` yang stabil.
2. Menerima HTTP 202 dan `id`, lalu memanggil `GET /v1/images/tasks/{id}` setiap 3 detik.
3. Saat `status=completed`, baca `url` atau `data[0]`; saat `status=failed`, tampilkan `error`. Jika query gagal, ulangi query saja, jangan POST pembuatan gambar lagi.
4. Kunci idempotensi yang sama dengan input yang sama mengembalikan tugas lama; kunci yang sama dengan input berbeda mengembalikan 409; antrean penuh mengembalikan 429. Satu proses berbagi satu browser, maksimal menerima 8 tugas gambar yang belum selesai.

`/v1/images/generations` JSON dan `/v1/images/edits` JSON/multipart versi lama juga dapat mengirim `async=true` untuk beralih ke pemrosesan asinkron yang sama. Perilaku sinkron default tidak berubah.
`timeout` adalah anggaran tunggu antrean dan pembuatan (1–600 detik), inisialisasi browser dan pengambilan hasil memiliki timeout masing-masing; klien sebaiknya terus melakukan polling sampai status akhir tugas.
Metadata tugas disimpan persisten; saat proses di-restart, tugas gambar yang belum selesai ditandai gagal, tanpa diam-diam dibuat ulang.
Pengujian interface gambar di halaman admin juga sudah diubah menjadi polling tugas.

Pemeriksaan regresi (tanpa mengonsumsi kuota pembuatan nyata):

```bash
python tests/test_async_images.py
python tests/test_vm_wait.py engine.py --assert
```

Memperbaiki race condition pada penanganan exception browser bersama yang me-reset tugas lain setelah unlock; tidak lagi menganggap teks sisa sidebar
`Connecting...` / `Still sending` sebagai bukti pembuatan gambar gagal dalam 16 detik.


## v1.5.3: Status Akun Abnormal & Troubleshooting Instance Self-Hosted

Permintaan keep-alive berasal dari **egress server deployment**, bukan dari browser tempat Cookie diekspor. Server penulis yang bisa dipakai tidak membuktikan jaringan, wilayah, konfigurasi proxy, atau sesi akun yang sama di server lain juga normal.

- `/api/session HTTP 401`: upstream menolak autentikasi. Pastikan dulu akun tersebut bisa login di situs resmi muse.ai, lalu impor ulang Cookie.
- `HTTP 403`: akses ditolak, bisa terkait izin akun, egress server, atau batasan wilayah/akses; **tidak sama dengan Cookie kedaluwarsa**. Periksa error lengkap dan jaringan deployment, jangan berulang kali mengimpor ulang secara membabi buta.
- `HTTP 429`, `5xx`, timeout, non-JSON, atau tidak mengembalikan `assigned`: keep-alive kali ini belum terkonfirmasi, tidak lagi dilaporkan sukses secara keliru atau menimpa status akun terakhir yang sudah terkonfirmasi; catatan menampilkan diagnosis. Jika status awal "belum dites" atau "abnormal", status tersebut juga tidak dipaksa menjadi "tersedia".
- Timeout pemuatan halaman browser juga tidak lagi langsung dianggap sebagai kegagalan autentikasi; hanya kegagalan autentikasi yang jelas yang menandai akun sebagai abnormal.
- "Tersedia" adalah hasil terkonfirmasi terbaru, tidak menjamin jaringan kali ini dapat dijangkau; "sisa masa berlaku" adalah waktu Cookie/nilai estimasi, bukan bukti sesi server masih valid. Pemeriksaan yang berhasil tidak lagi memperpanjang 48 jam begitu saja, perpanjangan mengikuti Cookie yang benar-benar dikembalikan.

Setelah memperbarui ke v1.5.3 dan me-restart layanan, klik "Tes" pada akun untuk mengonfirmasi ulang. Status abnormal lama yang sudah tertulis tidak akan dicuci menjadi normal tanpa syarat. Arahkan mouse ke catatan untuk melihat error lengkap; saat melaporkan, sertakan status HTTP, versi, dan environment deployment, **jangan mempublikasikan Cookie, API Key, atau tautan halaman admin yang mengandung key**.

Deployment Git bare metal: jalankan `git pull --ff-only` lalu restart layanan terkait; Docker Compose: `git pull --ff-only && docker compose up -d --build`. Simpan dulu modifikasi kustom lokal, pertahankan `.env` dan `data/`.

Tes regresi yang tidak memakai akun nyata dan tidak mengonsumsi kuota pembuatan:

```bash
python tests/test_session_health.py
```
# MUSE2API 1.6.1

## Catatan Pembaruan (2026-10-13)

- Memperbaiki query kuota multi-akun yang terbaca silang: query kuota terikat pada halaman browser akun terkait, agar saldo dan pemakaian tidak tampil salah antar akun.
- Jika pembacaan kuota gagal atau tidak ada data valid yang terbaca, cache lama dipertahankan dan kegagalan pembacaan dilaporkan secara eksplisit, agar hasil yang tidak valid tidak dianggap sebagai kuota real-time.
- Memperbaiki laporan sukses keep-alive yang keliru: membedakan permintaan wake-up yang sudah diterima dengan VM yang sudah berjalan, hanya jika status pemeriksaan ulang adalah RUNNING barulah wake-up dilaporkan berhasil.
- Halaman admin menampilkan waktu query kuota dan petunjuk kedaluwarsa; pengujian akun memberikan umpan balik terpisah untuk validitas sesi dan status pembacaan kuota.
- Menambahkan tes regresi offline, mencakup isolasi kuota akun dan konfirmasi status wake-up VM.

Penjelasan validasi materi referensi: video harus mengandung informasi durasi yang dapat diurai dan tidak lebih dari 120 detik (MP4/MOV/3GP/WebM);
informasi durasi yang hilang atau rusak akan ditolak. Jumlah halaman PDF, parsing dokumen, dan izin akun tetap divalidasi oleh upstream Muse,
konfirmasi lampiran proyek ini hanya menyatakan file sudah masuk ke area input, tidak menjamin upstream dapat membaca setiap jenis file.
Chromium dan layanan harus dapat mengakses file materi yang sama; materi sementara berada di direktori profil browser dan dibersihkan setelah tugas selesai.
