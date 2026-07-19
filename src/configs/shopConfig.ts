/*
 * Real business details, lifted from the WordPress contact page.
 *
 * OPEN QUESTION: the old site contradicted itself on closing time — the contact
 * page said 23:30, the homepage reservation block said 21:30. 23:30 is used
 * here because it appeared on the page dedicated to opening hours, but this
 * needs a client answer before launch.
 */

export const SHOP = {
  name: 'Kopi Teduh Roastery',

  // International format, no + or dashes — this is what wa.me expects.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6285394376023',
  phoneDisplay: '+62 853-9437-6023',

  email: 'kopiteduhposo@gmail.com',

  address: 'Jl. Ki Hajar Dewantara, Lombugia, Poso Kota Utara, Poso, Sulawesi Tengah 94616 (depan SMPN 5 Poso)',

  hours: {
    id: 'Selasa–Minggu, 09.00–23.30 WITA (Senin libur)',
    en: 'Tuesday–Sunday, 09:00–23:30 WITA (closed Monday)'
  },

  maps: 'https://maps.google.com/?q=Kopi+Teduh+Roastery+Poso',

  // `key` selects the brand glyph in components/storefront/SocialIcon.tsx.
  // Order here is the render order.
  social: [
    { key: 'instagram', label: 'Instagram', url: 'https://instagram.com/kopiteduhposo' },
    { key: 'facebook', label: 'Facebook', url: 'https://facebook.com/kopiteduhposo' },
    { key: 'x', label: 'X', url: 'https://x.com/kopiteduhposo' },
    { key: 'youtube', label: 'YouTube', url: 'https://youtube.com/kopiteduhposo' }
  ]
} as const
