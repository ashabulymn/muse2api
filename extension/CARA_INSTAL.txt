Ekstensi Impor Cookie Muse2API —— Petunjuk Instalasi
====================================================

Ekstensi ini hanya melakukan satu hal: menyinkronkan Cookie login
muse.ai dari browser Anda ke layanan muse2api Anda. Tidak perlu
menginstal Python, tidak perlu membuka terminal.


Satu, Ekstrak
-------------
Ekstrak muse2api-extension.zip ke direktori yang tidak akan Anda hapus, misalnya:

    Windows : D:\muse2api-extension
    macOS   : ~/Documents/muse2api-extension

Setelah diekstrak, Anda seharusnya melihat tiga file: manifest.json, popup.html, dan popup.js.


Dua, Memuat di Chrome / Edge
-----------------------------
Chrome:
  1. Ketik chrome://extensions di address bar, lalu tekan Enter
  2. Nyalakan sakelar "Mode pengembang" di kanan atas
  3. Klik "Muat ekstensi yang belum dipaketkan" di kiri atas
  4. Pilih folder hasil ekstrak pada langkah 1 (bukan file di dalamnya)
  5. Ikon puzzle muncul di toolbar; sematkan ke toolbar (opsional tapi praktis)

Edge:
  1. Ketik edge://extensions di address bar, lalu tekan Enter
  2. Nyalakan "Mode pengembang" di kiri bawah
  3. Klik "Muat ekstensi yang belum dipaketkan"
  4. Langkah selanjutnya sama seperti di atas

Browser berbasis Chromium lainnya (Brave / Vivaldi / 360 Extreme Explorer, dll.) langkahnya serupa.


Tiga, Penggunaan
----------------
1. Buka https://muse.ai/ di browser ini dan login,
   sampai Anda melihat antarmuka chat.
2. Di halaman admin muse2api, bagian atas halaman "Kolam Akun", salin BASE URL dan API Key.
3. Klik ikon ekstensi di toolbar browser, isi kedua kolom tersebut (cukup diisi sekali, akan diingat).
4. Di jendela yang sama dengan tempat Anda login Muse, klik "Baca & Impor". Untuk pemakaian Incognito/InPrivate, aktifkan dulu "Izinkan dalam mode Incognito" di detail ekstensi.
5. Periksa apakah "Sumber Cookie" pada hasil sesuai dengan jendela yang diharapkan, lalu uji akun di halaman admin. Impor berhasil hanya berarti penyimpanan berhasil, bukan berarti sesi sudah terverifikasi.


Empat, Masalah Umum
-------------------
Q: Jendela Incognito sudah login, tetapi yang terimpor adalah akun jendela biasa, atau pengujian menampilkan /api/session HTTP 401
A: Versi 1.0.2 dan yang lebih lama tidak memilih penyimpanan Cookie berdasarkan jendela saat ini, sehingga bisa membaca sesi lama dari jendela biasa.
   Unduh 1.0.3 dari halaman admin Muse2API Anda, ganti direktori ekstensi lama, lalu muat ulang; coba lagi di jendela yang sama dengan tempat Anda login Muse.
   Versi 1.0.3 akan menghentikan impor jika penyimpanan yang sesuai tidak ditemukan, dan tidak akan beralih ke jendela lain. Sesi yang sudah logout tetap harus login ulang di situs resmi.

Q: Muncul pesan "Cookie muse.ai tidak terbaca"
A: Artinya browser ini belum login ke muse.ai. Buka https://muse.ai/ dan login terlebih dahulu.

Q: Muncul pesan "Item inti hatch_sess, dll. tidak ada"
A: Sama seperti di atas — login belum selesai. Pastikan Anda sudah melihat antarmuka chat sebelum mengklik.

Q: Muncul pesan "API Key salah (layanan mengembalikan 401)"
A: Salin ulang API Key dari halaman admin. Perhatikan bahwa Key diawali m2a_.

Q: Muncul pesan error lintas domain / jaringan
A: Periksa apakah alamat layanan memakai https, dan apakah layanan itu sendiri bisa dibuka
   (coba buka langsung di browser: alamat-layanan/admin).

Q: Apakah Cookie saya akan dikirim ke tempat lain?
A: Tidak. Ekstensi memakai izin cookies, storage, dan activeTab; kodenya ada di popup.js,
   Anda bisa memeriksanya sendiri: ekstensi hanya mengirim satu POST ke alamat layanan yang Anda isi, tidak ada permintaan lain.


Lima, Uninstal
---------------
chrome://extensions → cari "Impor Cookie Muse2API" → Hapus.
