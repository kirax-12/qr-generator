# QR Generator

Bikin kode QR dari teks, link, atau WiFi — langsung dari browser, tanpa daftar dan tanpa server. Ketik isinya, pratinjau berubah saat itu juga, lalu unduh hasilnya sebagai PNG.

## Fitur

- **Dua mode konten**
  - **Teks / Link** — teks bebas apa pun: URL, nomor WhatsApp, alamat, catatan singkat.
  - **WiFi** — isi nama jaringan (SSID), password, dan tipe keamanan (WPA/WPA2, WEP, atau tanpa password). String format `WIFI:T:...;S:...;P:...;;` disusun otomatis, lengkap dengan *escaping* karakter khusus, jadi HP yang scan langsung tersambung.
- **Pratinjau langsung** — QR digambar ulang di canvas setiap kali ada perubahan (dengan *debounce* biar tetap ringan).
- **Ukuran PNG bisa dipilih** — 256, 512, atau 1024 piksel, dari kebutuhan chat sampai cetak.
- **Warna bisa diatur** — warna kode dan warna latar bebas dipilih lewat color picker.
- **Download PNG** — satu klik, file langsung tersimpan.
- **Level koreksi error M** dengan *quiet zone* 4 modul, jadi QR tetap mudah dipindai.
- **Pesan error yang jelas** kalau isi terlalu panjang untuk satu kode QR.
- **100% lokal** — semua proses berjalan di browser; tidak ada data yang dikirim ke mana pun.

## Cara Menjalankan

Nggak perlu build apa pun. Pilih salah satu:

1. Buka file `index.html` langsung di browser, atau
2. Jalankan server statis sederhana dari folder ini, misalnya:

   ```bash
   npx serve .
   ```

   atau

   ```bash
   python3 -m http.server 8000
   ```

   lalu buka `http://localhost:8000` di browser.

Catatan: butuh koneksi internet saat pertama kali dibuka karena font dan library QR dimuat dari CDN.

## Teknologi

- HTML, CSS, dan JavaScript vanilla — tanpa framework.
- [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (kazuhikoarase) via CDN cdnjs — QR digambar manual modul per modul ke `<canvas>` supaya warna dan ukuran bebas dikontrol dan unduhan PNG-nya gampang.
- Font Space Grotesk, Space Mono, dan Caveat dari Google Fonts.
- Gaya visual neo-brutalist khas Remike Dev: latar krem, border hitam 2px, bayangan offset keras, dan aksen warna flat.

## Struktur File

| File         | Isi                                                        |
| ------------ | ---------------------------------------------------------- |
| `index.html` | Struktur halaman dan formulir                              |
| `style.css`  | Seluruh tampilan                                           |
| `script.js`  | Logika pembuatan QR, mode WiFi, pratinjau, dan unduhan PNG |

---

Dibuat oleh Remike Dev
