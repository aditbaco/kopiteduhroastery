// Indonesian is the source of truth. `en.ts` mirrors this shape exactly — the
// Dictionary type is derived from this file, so adding a key here surfaces a
// type error in en.ts until it is translated.
const id = {
  meta: {
    title: 'Kopi Teduh Roastery — Kopi Poso, Sulawesi Tengah',
    description:
      'Roastery kopi spesialti dari Poso, Sulawesi Tengah. Arabika dan robusta dari dataran tinggi Lore, disangrai segar setiap minggu.'
  },
  nav: {
    home: 'Beranda',
    shop: 'Koleksi',
    about: 'Tentang Kami',
    brew: 'Seduhan',
    contact: 'Kontak',
    cart: 'Keranjang'
  },
  home: {
    heroTitle: 'Kopi dari tanah yang teduh.',
    heroLede:
      'Arabika dan robusta dari dataran tinggi Lore, Poso. Ditanam di bawah naungan, dipetik merah, disangrai segar setiap minggu.',
    heroCta: 'Lihat Koleksi',
    featuredTitle: 'Pilihan Istimewa',
    featuredLede: 'Tiga kopi yang paling menggambarkan karakter dataran tinggi kami.',
    storyTitle: 'Dari Poso, bukan dari mana-mana',
    allProducts: 'Lihat semua kopi'
  },
  shop: {
    title: 'Temukan kesegaran biji kopi dari dataran tinggi Poso.',
    lede: 'Arabika dan robusta single origin dari kebun-kebun Lore, Besoa, dan Tojo — disangrai segar setiap minggu. Siap untuk espresso maupun manual brew, digiling sesuai alat seduh Anda.',
    empty: 'Belum ada kopi yang tersedia.',
    filterAll: 'Semua',
    filterArabica: 'Arabika',
    filterRobusta: 'Robusta'
  },
  product: {
    origin: 'Asal',
    altitude: 'Ketinggian',
    varietal: 'Varietas',
    process: 'Proses',
    roast: 'Sangrai',
    producer: 'Petani',
    partnerSince: 'Bermitra sejak',
    tastingNotes: 'Taste Notes',
    weight: 'Berat',
    grind: 'Gilingan',
    qty: 'Jumlah',
    addToCart: 'Tambah ke Keranjang',
    added: 'Ditambahkan',
    outOfStock: 'Stok habis',
    back: 'Kembali ke koleksi'
  },
  cart: {
    title: 'Keranjang',
    empty: 'Keranjang masih kosong.',
    emptyCta: 'Mulai belanja',
    item: 'produk',
    items: 'produk',
    subtotal: 'Subtotal',
    total: 'Total',
    note: 'Catatan untuk kami',
    notePlaceholder: 'Alamat, permintaan khusus, atau catatan lain…',
    checkout: 'Pesan via WhatsApp',
    checkoutHint: 'Pesanan diteruskan ke WhatsApp kami. Ongkir dan pembayaran dibahas di sana.',
    remove: 'Hapus',
    shippingNote: 'Ongkos kirim dihitung terpisah'
  },

  // Hover panel on the cart icon. Deliberately short: it is a glance, not a page.
  cartMenu: {
    emptyTitle: 'Keranjang Anda Kosong',
    emptyLede: 'Mulai belanja sekarang dan temukan kopi yang Anda cari.',
    emptyCta: 'Cari Kopi',
    viewCart: 'Lihat Keranjang',
    more: 'produk lainnya'
  },
  legal: {
    heading: 'Informasi',
    guide: 'Panduan Berbelanja',
    privacy: 'Kebijakan Privasi',
    terms: 'Syarat & Ketentuan',
    updated: 'Terakhir diperbarui'
  },
  process: {
    WASHED: 'Full Washed',
    NATURAL: 'Natural',
    HONEY: 'Honey',
    WINE: 'Wine',
    WET_HULLED: 'Giling Basah'
  },
  roast: {
    LIGHT: 'Light',
    MEDIUM_LIGHT: 'Medium Light',
    MEDIUM: 'Medium',
    MEDIUM_DARK: 'Medium Dark',
    DARK: 'Dark'
  },
  species: {
    ARABICA: 'Arabika',
    ROBUSTA: 'Robusta'
  },
  contact: {
    title: 'Kontak Kami',
    address: 'Alamat',
    hours: 'Jam Buka',
    phone: 'Telepon',
    email: 'Email',
    emailUs: 'Email ke kami', // link label; the address itself stays on the contact page
    whatsapp: 'Chat WhatsApp'
  },
  common: {
    langLabel: 'Bahasa',
    menu: 'Menu',
    close: 'Tutup',
    loading: 'Memuat…'
  }
} as const

export default id
