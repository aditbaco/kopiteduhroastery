/*
 * Long-form copy for the three information pages. Kept out of the dictionary
 * files (which hold UI chrome — labels, buttons, nav) because this is page
 * content: it is edited by the business, not by whoever is translating a button.
 *
 * IMPORTANT — read before launch.
 *
 * The shopping guide describes the checkout flow as it is actually implemented
 * (localStorage cart → WhatsApp handoff), so it is accurate today and will need
 * rewriting if that flow changes.
 *
 * The privacy and terms pages are written to be TRUE of this site rather than
 * copied from a template: they claim no accounts, no payment processing, and no
 * analytics because the site genuinely has none of those. Three things still
 * need a decision from the client, marked NEEDS CONFIRMATION below:
 *
 *   1. Legal entity name — "Kopi Teduh Roastery" is the trading name; if there
 *      is a CV/PT behind it, that is what belongs in the terms.
 *   2. Return/complaint window — 2×24 hours from delivery is the Indonesian
 *      e-commerce norm and is used here as a starting point, not a client answer.
 *   3. Courier list — the couriers named are placeholders.
 *
 * This is not legal advice and has not been reviewed by a lawyer.
 */

// Type Imports
import type { Lang } from '@/dictionaries'

export type LegalSection = {
  heading: string

  /** Rendered as paragraphs. */
  body?: string[]

  /** Rendered as a numbered list — used for the ordering steps. */
  steps?: { title: string; detail: string }[]

  /** Rendered as a bulleted list. */
  points?: string[]
}

export type LegalDoc = {
  title: string
  lede: string
  sections: LegalSection[]
}

/** Shown under every page title. Bump when the copy below actually changes. */
export const LEGAL_UPDATED = '19 Juli 2026'

const guide: Record<Lang, LegalDoc> = {
  id: {
    title: 'Panduan Berbelanja',
    lede: 'Pemesanan di Kopi Teduh Roastery diselesaikan lewat WhatsApp — tidak perlu membuat akun, tidak perlu memasukkan data kartu. Berikut alurnya dari awal sampai kopi sampai di tangan Anda.',
    sections: [
      {
        heading: 'Langkah pemesanan',
        steps: [
          {
            title: 'Pilih kopi di halaman Koleksi',
            detail:
              'Setiap kopi punya halaman sendiri berisi asal kebun, ketinggian, proses pascapanen, tingkat sangrai, dan taste notes. Kalau masih ragu, WhatsApp kami — kami bantu pilihkan sesuai alat seduh Anda.'
          },
          {
            title: 'Tentukan ukuran dan gilingan',
            detail:
              'Pilih berat kemasan, lalu pilih gilingan sesuai alat seduh: biji utuh, espresso, V60, tubruk, French press, atau moka pot. Kalau Anda punya grinder sendiri, pilih biji utuh — kopi lebih awet segar.'
          },
          {
            title: 'Masukkan ke keranjang',
            detail:
              'Keranjang tersimpan di peramban Anda sendiri, jadi isinya tidak hilang kalau halaman ditutup. Anda bisa menambah beberapa kopi sekaligus sebelum memesan.'
          },
          {
            title: 'Tekan “Pesan via WhatsApp”',
            detail:
              'Isi keranjang otomatis tersusun menjadi pesan WhatsApp yang rapi — nama kopi, berat, gilingan, jumlah, dan total harga. Anda bisa membacanya dulu sebelum mengirim, dan menambahkan catatan seperti alamat atau permintaan khusus.'
          },
          {
            title: 'Konfirmasi ongkir dan pembayaran',
            detail:
              'Kami balas dengan ongkos kirim ke alamat Anda dan nomor rekening untuk transfer. Ongkir tidak dihitung di website karena tergantung tujuan dan berat total.'
          },
          {
            title: 'Kami sangrai, kemas, dan kirim',
            detail:
              'Setelah pembayaran dikonfirmasi, pesanan kami siapkan dan nomor resi kami kirimkan lewat WhatsApp yang sama.'
          }
        ]
      },
      {
        heading: 'Kenapa lewat WhatsApp?',
        body: [
          'Karena kopi bukan barang yang seragam. Stok berubah mengikuti panen, dan gilingan yang tepat tergantung alat seduh yang Anda pakai di rumah. Percakapan singkat jauh lebih berguna daripada formulir checkout yang kaku.',
          'Selain itu, Anda tidak perlu menitipkan data kartu atau membuat akun di website kami. Pembayaran dilakukan langsung lewat transfer bank, seperti biasa.'
        ]
      },
      {
        heading: 'Tentang kesegaran',
        body: [
          'Kami menyangrai dalam batch kecil setiap minggu, jadi kopi yang Anda terima adalah sangraian terbaru. Untuk hasil terbaik, seduh dalam 2–4 minggu setelah tanggal sangrai dan simpan di wadah kedap udara, jauh dari panas dan sinar matahari langsung.',
          'Kopi yang sudah digiling kehilangan aroma jauh lebih cepat. Kalau Anda punya grinder, pesan dalam bentuk biji utuh.'
        ]
      },
      {
        heading: 'Pesanan besar dan kedai',
        body: [
          'Untuk kebutuhan kafe, kantor, oleh-oleh, atau pemesanan di atas 5 kg, hubungi kami lewat WhatsApp. Harga dan pengemasan menyesuaikan volume.'
        ]
      }
    ]
  },
  en: {
    title: 'Shopping Guide',
    lede: 'Orders at Kopi Teduh Roastery are completed over WhatsApp — no account to create, no card details to enter. Here is how it works, from browsing to delivery.',
    sections: [
      {
        heading: 'How to order',
        steps: [
          {
            title: 'Choose a coffee from the Collection',
            detail:
              'Every coffee has its own page with the garden it came from, altitude, processing method, roast level, and tasting notes. If you are unsure, message us — we will help you pick one for your brewer.'
          },
          {
            title: 'Pick a size and grind',
            detail:
              'Choose your bag size, then the grind that matches your brewer: whole bean, espresso, V60, tubruk, French press, or moka pot. If you own a grinder, choose whole bean — the coffee stays fresh far longer.'
          },
          {
            title: 'Add it to your cart',
            detail:
              'The cart is stored in your own browser, so it survives closing the page. You can add several coffees before ordering.'
          },
          {
            title: 'Tap “Order via WhatsApp”',
            detail:
              'Your cart is turned into a tidy WhatsApp message — coffee name, weight, grind, quantity, and total. You can read it before sending, and add a note such as your address or a special request.'
          },
          {
            title: 'Confirm shipping and payment',
            detail:
              'We reply with the shipping cost to your address and the bank account for transfer. Shipping is not calculated on the website because it depends on destination and total weight.'
          },
          {
            title: 'We roast, pack, and ship',
            detail:
              'Once payment is confirmed we prepare your order and send the tracking number through the same WhatsApp chat.'
          }
        ]
      },
      {
        heading: 'Why WhatsApp?',
        body: [
          'Because coffee is not a uniform product. Stock moves with the harvest, and the right grind depends on the brewer sitting on your kitchen counter. A short conversation is far more useful than a rigid checkout form.',
          'It also means you never hand card details to our website or create an account. Payment is by bank transfer, as usual here.'
        ]
      },
      {
        heading: 'On freshness',
        body: [
          'We roast in small batches every week, so what you receive is the most recent roast. For the best cup, brew within 2–4 weeks of the roast date and store the beans in an airtight container away from heat and direct sunlight.',
          'Ground coffee loses its aroma much faster. If you have a grinder, order whole beans.'
        ]
      },
      {
        heading: 'Wholesale and cafés',
        body: [
          'For cafés, offices, gifts, or orders above 5 kg, get in touch on WhatsApp. Pricing and packaging are adjusted to volume.'
        ]
      }
    ]
  }
}

const privacy: Record<Lang, LegalDoc> = {
  id: {
    title: 'Kebijakan Privasi',
    lede: 'Website ini mengumpulkan data sesedikit mungkin. Halaman ini menjelaskan apa yang benar-benar terjadi dengan data Anda — bukan salinan template.',
    sections: [
      {
        heading: 'Yang tidak kami kumpulkan',
        body: [
          'Website ini tidak memiliki sistem akun, jadi tidak ada pendaftaran, kata sandi, atau profil pengguna. Tidak ada formulir pendaftaran newsletter. Tidak ada pemrosesan pembayaran di website ini, sehingga tidak ada data kartu atau rekening yang pernah melewati server kami.'
        ]
      },
      {
        heading: 'Keranjang belanja',
        body: [
          'Isi keranjang Anda disimpan di penyimpanan lokal (localStorage) peramban Anda sendiri, di perangkat Anda. Data itu tidak dikirim ke server kami sampai Anda menekan tombol pesan. Menghapus data peramban akan mengosongkan keranjang.'
        ]
      },
      {
        heading: 'Saat Anda memesan lewat WhatsApp',
        body: [
          'Ketika Anda menekan “Pesan via WhatsApp”, pesan berisi rincian pesanan disiapkan di aplikasi WhatsApp Anda. Pesan baru terkirim jika Anda sendiri yang mengirimnya.',
          'Setelah itu, percakapan berlangsung di WhatsApp dan tunduk pada kebijakan privasi WhatsApp, bukan kebijakan ini. Data yang Anda berikan di sana — nama, nomor telepon, alamat pengiriman, bukti transfer — kami gunakan hanya untuk memproses dan mengirim pesanan Anda, serta menyimpan catatan transaksi sebagaimana lazimnya usaha kecil.',
          'Kami tidak menjual, menyewakan, atau menukarkan data Anda kepada pihak lain. Alamat pengiriman kami berikan kepada jasa kurir semata-mata agar paket sampai.'
        ]
      },
      {
        heading: 'Gambar dan layanan pihak ketiga',
        body: [
          'Sebagian foto dekoratif di website ini dimuat dari layanan gambar pihak ketiga, sehingga peramban Anda menghubungi server mereka saat halaman dibuka. Website ini tidak memasang cookie pelacak, piksel iklan, maupun perangkat analitik.',
          'Seperti semua website, penyedia hosting kami mencatat permintaan server (termasuk alamat IP) untuk keperluan teknis dan keamanan.'
        ]
      },
      {
        heading: 'Hak Anda',
        body: [
          'Anda berhak meminta salinan data yang kami simpan tentang Anda, meminta koreksi, atau meminta penghapusan data yang tidak lagi kami perlukan untuk catatan transaksi. Hubungi kami lewat WhatsApp atau email di halaman Kontak.'
        ]
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    lede: 'This website collects as little as possible. This page describes what actually happens to your data — it is not a copied template.',
    sections: [
      {
        heading: 'What we do not collect',
        body: [
          'This website has no account system, so there is no sign-up, no password, and no user profile. There is no newsletter form. No payment is processed on this website, so card or bank details never pass through our servers.'
        ]
      },
      {
        heading: 'Your cart',
        body: [
          'Your cart is stored in your own browser (localStorage), on your device. Nothing is sent to our servers until you tap the order button. Clearing your browser data empties the cart.'
        ]
      },
      {
        heading: 'When you order via WhatsApp',
        body: [
          'Tapping “Order via WhatsApp” prepares a message containing your order in your own WhatsApp app. It is only sent if you send it.',
          'From that point the conversation happens on WhatsApp and is governed by WhatsApp’s privacy policy, not this one. What you share there — name, phone number, delivery address, proof of transfer — is used only to process and ship your order and to keep ordinary business records.',
          'We do not sell, rent, or trade your data. Your address is shared with the courier for the sole purpose of delivering the parcel.'
        ]
      },
      {
        heading: 'Images and third-party services',
        body: [
          'Some decorative photographs are loaded from a third-party image service, so your browser contacts their servers when a page loads. This website sets no tracking cookies, advertising pixels, or analytics tools.',
          'As with any website, our hosting provider logs server requests (including IP addresses) for technical and security purposes.'
        ]
      },
      {
        heading: 'Your rights',
        body: [
          'You may ask for a copy of the data we hold about you, ask us to correct it, or ask us to delete anything we no longer need for transaction records. Contact us via WhatsApp or the email address on the Contact page.'
        ]
      }
    ]
  }
}

const terms: Record<Lang, LegalDoc> = {
  id: {
    title: 'Syarat & Ketentuan',
    lede: 'Ketentuan berikut berlaku untuk pembelian kopi dari Kopi Teduh Roastery melalui website ini dan WhatsApp.',
    sections: [
      {
        heading: 'Pemesanan',
        body: [
          'Website ini menampilkan katalog dan harga; pemesanan diselesaikan lewat percakapan WhatsApp. Pesanan dianggap sah setelah kami konfirmasi ketersediaan stok dan Anda menyelesaikan pembayaran.',
          'Kami berhak menolak atau membatalkan pesanan jika stok habis, alamat tidak terjangkau kurir, atau pembayaran tidak dapat diverifikasi. Jika pembayaran sudah masuk, dana dikembalikan penuh.'
        ]
      },
      {
        heading: 'Harga dan pembayaran',
        body: [
          'Seluruh harga ditampilkan dalam Rupiah dan belum termasuk ongkos kirim. Ongkos kirim dihitung berdasarkan tujuan dan berat total, lalu diinformasikan sebelum pembayaran.',
          'Harga kopi mengikuti harga beli dari petani dan biaya produksi, sehingga dapat berubah sewaktu-waktu. Harga yang berlaku adalah harga yang kami konfirmasikan di WhatsApp saat pesanan dibuat.',
          'Pembayaran dilakukan melalui transfer bank ke rekening resmi Kopi Teduh Roastery. Kami tidak pernah meminta data kartu, PIN, atau kode OTP.'
        ]
      },
      {
        heading: 'Pengiriman',
        body: [
          'Pesanan dikirim melalui jasa kurir pihak ketiga. Estimasi waktu pengiriman berasal dari kurir dan berada di luar kendali kami; keterlambatan yang disebabkan kurir, cuaca, atau hari libur bukan tanggung jawab kami.',
          'Nomor resi kami kirimkan lewat WhatsApp setelah paket diserahkan ke kurir. Pastikan alamat dan nomor telepon yang Anda berikan sudah benar — kesalahan alamat yang menyebabkan paket kembali menjadi tanggungan pembeli.'
        ]
      },
      {
        heading: 'Komplain dan penukaran',
        body: [
          'Kopi adalah produk konsumsi yang disangrai sesuai pesanan, sehingga tidak dapat dikembalikan karena perubahan pikiran atau karena profil rasanya kurang sesuai selera.',
          'Jika paket rusak dalam pengiriman, isinya keliru, atau kopi bermasalah, hubungi kami paling lambat 2×24 jam sejak paket diterima dan sertakan foto paket beserta produknya. Kami akan mengganti produk atau mengembalikan dana.'
        ]
      },
      {
        heading: 'Hak kekayaan intelektual',
        body: [
          'Seluruh teks, foto, logo, dan materi lain di website ini adalah milik Kopi Teduh Roastery dan tidak boleh digunakan kembali tanpa izin tertulis.'
        ]
      },
      {
        heading: 'Perubahan ketentuan',
        body: [
          'Ketentuan ini dapat kami perbarui sewaktu-waktu. Ketentuan yang berlaku untuk pesanan Anda adalah yang tercantum di halaman ini pada saat pesanan dibuat.'
        ]
      }
    ]
  },
  en: {
    title: 'Terms & Conditions',
    lede: 'These terms apply to coffee purchased from Kopi Teduh Roastery through this website and WhatsApp.',
    sections: [
      {
        heading: 'Orders',
        body: [
          'This website shows the catalogue and prices; orders are completed in a WhatsApp conversation. An order is confirmed once we have confirmed stock and you have completed payment.',
          'We may decline or cancel an order if stock has run out, the address cannot be reached by courier, or payment cannot be verified. If payment has already been made, it is refunded in full.'
        ]
      },
      {
        heading: 'Prices and payment',
        body: [
          'All prices are shown in Indonesian Rupiah and exclude shipping. Shipping is calculated from the destination and total weight, and confirmed before payment.',
          'Coffee prices follow what we pay farmers and what production costs, so they may change. The price that applies is the one we confirm on WhatsApp when the order is placed.',
          'Payment is by bank transfer to the official Kopi Teduh Roastery account. We will never ask for card details, a PIN, or an OTP code.'
        ]
      },
      {
        heading: 'Shipping',
        body: [
          'Orders are shipped by third-party couriers. Delivery estimates come from the courier and are outside our control; delays caused by couriers, weather, or public holidays are not our responsibility.',
          'We send the tracking number on WhatsApp once the parcel is handed to the courier. Please check the address and phone number you give us — parcels returned because of an incorrect address are at the buyer’s cost.'
        ]
      },
      {
        heading: 'Complaints and replacements',
        body: [
          'Coffee is a consumable roasted to order, so it cannot be returned because of a change of mind or because the flavour profile was not to your taste.',
          'If a parcel arrives damaged, the contents are wrong, or there is a problem with the coffee, contact us within 2×24 hours of delivery with photographs of the parcel and the product. We will replace the product or refund you.'
        ]
      },
      {
        heading: 'Intellectual property',
        body: [
          'All text, photographs, logos, and other material on this website belong to Kopi Teduh Roastery and may not be reused without written permission.'
        ]
      },
      {
        heading: 'Changes to these terms',
        body: [
          'We may update these terms. The terms that apply to your order are the ones published on this page at the time the order was placed.'
        ]
      }
    ]
  }
}

export const LEGAL_DOCS = { guide, privacy, terms } as const

export type LegalDocKey = keyof typeof LEGAL_DOCS

/*
 * Slugs stay Indonesian in both locales, matching /koleksi, /tentang and
 * /kontak — one URL per page, so a link shared from the English site still
 * resolves and there is nothing to redirect later.
 */
export const LEGAL_SLUG: Record<LegalDocKey, string> = {
  guide: 'panduan-berbelanja',
  privacy: 'kebijakan-privasi',
  terms: 'syarat-ketentuan'
}
