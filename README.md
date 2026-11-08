# NexaCrypto

Dashboard cryptocurrency responsif untuk menjelajahi peringkat dan harga aset digital. Data diambil dari [CoinLore API](https://www.coinlore.com/cryptocurrency-data-api) saat aplikasi dibuka atau saat pengguna meminta pembaruan.

## Fitur

- Daftar aset dengan peringkat, nama, simbol, harga USD, dan perubahan harga 24 jam.
- Ringkasan aset peringkat pertama dan jumlah aset yang tersedia.
- Refresh melalui tombol atau gerakan tarik ke bawah pada perangkat sentuh.
- Pencarian nama dan simbol pada data yang sudah dimuat.
- Navigasi data bertahap dengan ringkasan progres dan tombol **Lihat lebih banyak**.
- Mode gelap dan terang; pilihan disimpan di browser.
- Tampilan responsif untuk ponsel, tablet, dan desktop.
- Status pemuatan, hasil pencarian kosong, dan pesan saat permintaan API gagal.

## Teknologi

- Ionic Vue dan Vue 3
- TypeScript
- Vite
- Axios
- Ionicons

## Menjalankan secara lokal

Pastikan Node.js LTS dan npm tersedia, lalu jalankan:

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite di terminal. Aplikasi membutuhkan koneksi internet untuk mengambil data pasar. Tidak diperlukan API key.

## Build produksi

```bash
npm run build
npm run preview
```

`npm run build` menjalankan pemeriksaan tipe dengan `vue-tsc`, lalu membuat berkas produksi di direktori `dist/`.

Versi publik: <https://andripriyandi.github.io/crypto-msim4401/home/>.

## Struktur proyek

```text
src/
├── data/
│   └── coins.ts             # Tipe data dan client CoinLore API
├── router/
│   └── index.ts             # Rute aplikasi
├── theme/
│   ├── app.css              # Tata letak dan gaya utama
│   ├── light.css            # Gaya mode terang dan tombol tema
│   └── variables.css        # Variabel tema Ionic
├── views/
│   └── MarketPage.vue       # Dashboard pasar dan interaksi pengguna
├── App.vue                  # Root Ionic
└── main.ts                  # Entry point aplikasi
```

## Sumber data

Permintaan dilakukan ke `https://api.coinlore.net/api/tickers/` melalui `src/data/coins.ts`. Setiap permintaan mengambil hingga 100 aset menggunakan parameter `start` dan `limit`. Aplikasi memakai `data` untuk daftar aset dan `info.coins_num` untuk mengetahui apakah masih ada halaman berikutnya.

Harga ditampilkan sebagai USD tanpa mengubah nilai dari API. Data pasar dapat berubah; tombol Refresh meminta respons terbaru. Pencarian bekerja pada aset yang sudah dimuat, sehingga aset pada halaman berikutnya baru dapat dicari setelah halaman tersebut dimuat.

## Catatan pengembangan

- Endpoint dan ukuran halaman dapat diubah di `src/data/coins.ts`.
- Preferensi tema disimpan dengan key `nexa-theme` di `localStorage`.
- Permintaan API memiliki timeout 15 detik. Jika pembaruan gagal, data yang sudah tampil tetap tersedia.
