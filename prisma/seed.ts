/*
 * Seed: the five coffees Kopi Teduh actually lists on the WordPress "Seduhan"
 * page. Origin, altitude and varietal are real, taken from that page.
 *
 * PLACEHOLDER — needs client confirmation before launch:
 *   - all prices
 *   - all tasting notes
 *   - all producer names and partnership years
 *   - process and roast level (not stated anywhere on the old site)
 *   - the descriptions, which are written to plausible house style
 *
 * Indonesian is the source of truth; English is a translation of it.
 */

// Runs standalone under tsx, outside Next and outside prisma.config.ts, so it
// has to load .env itself.
import 'dotenv/config'

import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { PrismaClient, Species, Process, RoastLevel } from '../src/generated/prisma/client'

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL as string) })

// Varietals are shared, so define once and connect by slug. Most are cultivar
// proper nouns that stay untranslated.
const VARIETALS = [
  { slug: 'sigararutang', name: 'Sigararutang' },
  { slug: 'kartika', name: 'Kartika' },
  { slug: 'lini-s', name: 'Lini S' },
  { slug: 'timtim', name: 'Timtim' },
  { slug: 'typica', name: 'Typica' },
  { slug: 'robusta-lokal', name: 'Robusta Lokal', nameEn: 'Local Robusta' }
]

const GRIND_OPTIONS = [
  {
    slug: 'biji-utuh',
    name: 'Biji Utuh',
    nameEn: 'Whole Bean',
    note: 'Digiling sendiri di rumah',
    noteEn: 'Grind it yourself at home',
    isDefault: true,
    sortOrder: 0
  },
  { slug: 'v60', name: 'V60 / Pour Over', nameEn: 'V60 / Pour Over', note: 'Gilingan medium', noteEn: 'Medium grind', sortOrder: 1 },
  { slug: 'espresso', name: 'Espresso', nameEn: 'Espresso', note: 'Gilingan halus', noteEn: 'Fine grind', sortOrder: 2 },
  { slug: 'tubruk', name: 'Tubruk', nameEn: 'Tubruk', note: 'Gilingan halus', noteEn: 'Fine grind', sortOrder: 3 },
  {
    slug: 'french-press',
    name: 'French Press',
    nameEn: 'French Press',
    note: 'Gilingan kasar',
    noteEn: 'Coarse grind',
    sortOrder: 4
  },
  {
    slug: 'vietnam-drip',
    name: 'Vietnam Drip',
    nameEn: 'Vietnam Drip',
    note: 'Gilingan medium-kasar',
    noteEn: 'Medium-coarse grind',
    sortOrder: 5
  }
]

type ProductSeed = {
  slug: string
  name: string
  nameEn: string
  species: Species
  origin: string
  regency: string
  altitudeMin: number
  altitudeMax: number
  process: Process
  roastLevel: RoastLevel
  shortDesc: string
  shortDescEn: string
  description: string
  descriptionEn: string
  producer: string
  partnerSince: number
  isFeatured: boolean
  sortOrder: number
  varietals: string[]

  // [Indonesian, English]
  tastingNotes: [string, string][]

  // [weight in grams, price in rupiah]
  variants: [number, number][]
}

const PRODUCTS: ProductSeed[] = [
  {
    slug: 'arabika-sulawesi-lore',
    name: 'Arabika Sulawesi Lore',
    nameEn: 'Sulawesi Lore Arabica',
    species: Species.ARABICA,
    origin: 'Lore Betue, Lore Wuasa & Lembah Besoa',
    regency: 'Poso',
    altitudeMin: 1100,
    altitudeMax: 1200,
    process: Process.WASHED,
    roastLevel: RoastLevel.MEDIUM,
    shortDesc: 'Manis seimbang dengan cokelat susu dan jeruk manis.',
    shortDescEn: 'Balanced sweetness with milk chocolate and sweet orange.',
    description:
      'Kopi rumah kami, dan cara paling jujur untuk mengenal dataran tinggi Lore. Ceri kopi dipetik merah oleh petani di Lore Betue, Lore Wuasa, dan Lembah Besoa, lalu diproses basah untuk menjaga rasa manis dan kejernihan karakternya. Hasilnya secangkir yang mudah diminum setiap hari — cokelat susu di awal, jeruk manis di tengah, dan akhir yang bersih. Cocok diseduh manual maupun tubruk.',
    descriptionEn:
      'Our house coffee, and the most honest introduction to the Lore highlands. Cherries are picked ripe by farmers across Lore Betue, Lore Wuasa and the Besoa valley, then washed to protect the sweetness and clarity of the cup. The result is easy to drink every day — milk chocolate up front, sweet orange through the middle, and a clean finish. Works equally well brewed manually or as tubruk.',
    producer: 'Petani Dataran Lore',
    partnerSince: 2019,
    isFeatured: true,
    sortOrder: 0,
    varietals: ['sigararutang'],
    tastingNotes: [
      ['Cokelat susu', 'Milk chocolate'],
      ['Jeruk manis', 'Sweet orange'],
      ['Karamel', 'Caramel']
    ],
    variants: [
      [200, 85000],
      [500, 195000],
      [1000, 370000]
    ]
  },
  {
    slug: 'lore-wuasa',
    name: 'Lore Wuasa',
    nameEn: 'Lore Wuasa',
    species: Species.ARABICA,
    origin: 'Lore Wuasa, Lore Utara',
    regency: 'Poso',
    altitudeMin: 1000,
    altitudeMax: 1100,
    process: Process.WET_HULLED,
    roastLevel: RoastLevel.MEDIUM,
    shortDesc: 'Bertubuh tebal dengan gula aren, kayu manis, dan cokelat hitam.',
    shortDescEn: 'Full-bodied, with palm sugar, cinnamon and dark chocolate.',
    description:
      'Lot dari satu desa di Lore Utara, diproses giling basah seperti yang sudah lama dilakukan petani di sini. Metode ini memberi tubuh yang tebal dan rasa rempah yang khas Indonesia — gula aren, sedikit kayu manis, ditutup cokelat hitam. Empat varietas tumbuh berdampingan di kebun yang sama, dan campuran itulah yang membuat karakternya dalam. Paling enak sebagai espresso atau kopi susu.',
    descriptionEn:
      'A single-village lot from North Lore, wet-hulled the way farmers here have long done it. The method gives the coffee a heavy body and the spiced character that reads as unmistakably Indonesian — palm sugar, a touch of cinnamon, closing on dark chocolate. Four varietals grow side by side in the same gardens, and that mix is what gives the cup its depth. Best as espresso or with milk.',
    producer: 'Kelompok Tani Wuasa',
    partnerSince: 2020,
    isFeatured: true,
    sortOrder: 1,
    varietals: ['sigararutang', 'kartika', 'lini-s', 'timtim'],
    tastingNotes: [
      ['Gula aren', 'Palm sugar'],
      ['Kayu manis', 'Cinnamon'],
      ['Cokelat hitam', 'Dark chocolate']
    ],
    variants: [
      [200, 90000],
      [500, 205000],
      [1000, 390000]
    ]
  },
  {
    slug: 'lembah-besoa',
    name: 'Lembah Besoa',
    nameEn: 'Besoa Valley',
    species: Species.ARABICA,
    origin: 'Lembah Besoa, Lore Peore',
    regency: 'Poso',
    altitudeMin: 1200,
    altitudeMax: 1300,
    process: Process.NATURAL,
    roastLevel: RoastLevel.MEDIUM_LIGHT,
    shortDesc: 'Buah merah, bunga, dan madu — kebun tertinggi kami.',
    shortDescEn: 'Red fruit, florals and honey — our highest-grown lot.',
    description:
      'Kebun tertinggi yang kami sumber, di lembah yang dikelilingi situs megalitik Besoa. Ketinggian 1.200–1.300 mdpl membuat ceri matang lebih lambat, dan rasa manisnya terkunci lebih rapat. Kami proses natural — ceri dikeringkan utuh di bawah matahari — untuk mengangkat sisi buah dan bunganya. Secangkir yang lebih cerah dan wangi dibanding kopi Lore lainnya. Sangat dianjurkan diseduh V60 agar aromanya terbuka penuh.',
    descriptionEn:
      'The highest gardens we source from, in a valley ringed by the Besoa megalithic sites. At 1,200–1,300 masl the cherries ripen slowly, which locks the sweetness in tighter. We process it naturally — whole cherries dried in the sun — to lift the fruit and floral side. Brighter and more aromatic than our other Lore coffees. We strongly recommend a V60 to let the aroma open up.',
    producer: 'Petani Lembah Besoa',
    partnerSince: 2021,
    isFeatured: true,
    sortOrder: 2,
    varietals: ['sigararutang', 'typica'],
    tastingNotes: [
      ['Buah merah', 'Red fruit'],
      ['Bunga', 'Floral'],
      ['Madu', 'Honey']
    ],
    variants: [
      [200, 95000],
      [500, 220000],
      [1000, 420000]
    ]
  },
  {
    slug: 'robusta-sulawesi-lore',
    name: 'Robusta Sulawesi Lore',
    nameEn: 'Sulawesi Lore Robusta',
    species: Species.ROBUSTA,
    origin: 'Lore Betue, Lore Wuasa & Lembah Besoa',
    regency: 'Poso',
    altitudeMin: 1100,
    altitudeMax: 1200,
    process: Process.WET_HULLED,
    roastLevel: RoastLevel.MEDIUM_DARK,
    shortDesc: 'Robusta dataran tinggi — pekat, cokelat, dan kacang panggang.',
    shortDescEn: 'High-grown robusta — dense, chocolatey, roasted nuts.',
    description:
      'Robusta yang tumbuh di ketinggian yang biasanya disediakan untuk arabika, dan bedanya terasa. Lebih bersih dan tidak sekasar robusta dataran rendah, tapi tetap membawa tubuh tebal dan kepekatan yang dicari peminum kopi susu. Cokelat gelap dan kacang panggang di depan, dengan akhir yang panjang. Pilihan kami untuk es kopi susu dan campuran espresso.',
    descriptionEn:
      'Robusta grown at altitudes usually reserved for arabica, and the difference shows. Cleaner and less coarse than lowland robusta, but it keeps the heavy body and intensity that milk-coffee drinkers are after. Dark chocolate and roasted nuts up front, with a long finish. This is our pick for es kopi susu and for espresso blends.',
    producer: 'Petani Dataran Lore',
    partnerSince: 2019,
    isFeatured: false,
    sortOrder: 3,
    varietals: ['robusta-lokal'],
    tastingNotes: [
      ['Cokelat hitam', 'Dark chocolate'],
      ['Kacang panggang', 'Roasted nuts'],
      ['Tembakau manis', 'Sweet tobacco']
    ],
    variants: [
      [200, 60000],
      [500, 135000],
      [1000, 250000]
    ]
  },
  {
    slug: 'robusta-sulawesi-tojo',
    name: 'Robusta Sulawesi Tojo',
    nameEn: 'Sulawesi Tojo Robusta',
    species: Species.ROBUSTA,
    origin: 'Tombiano & Nggawia, Tojo Barat',
    regency: 'Tojo Una-Una',
    altitudeMin: 750,
    altitudeMax: 1000,
    process: Process.WET_HULLED,
    roastLevel: RoastLevel.DARK,
    shortDesc: 'Kuat dan membumi, dengan rempah dan cokelat pahit.',
    shortDescEn: 'Strong and earthy, with spice and bitter chocolate.',
    description:
      'Dari Tombiano dan Nggawia di Tojo Barat, kebun yang lebih dekat pantai dan lebih rendah — dan menghasilkan kopi yang lebih tegas. Sangrai gelap membawa keluar rempah dan cokelat pahitnya, dengan tubuh yang berat dan sedikit rasa gurih. Ini kopi untuk yang suka pahit dan pekat, diseduh tubruk pagi-pagi. Harga paling ramah di rak kami.',
    descriptionEn:
      'From Tombiano and Nggawia in West Tojo — gardens closer to the coast and lower down, which makes for a more assertive coffee. A dark roast brings out its spice and bitter chocolate, with a heavy body and a faintly savoury edge. This is the one for people who like it bitter and strong, brewed tubruk first thing in the morning. The friendliest price on our shelf.',
    producer: 'Petani Tojo Barat',
    partnerSince: 2022,
    isFeatured: false,
    sortOrder: 4,
    varietals: ['robusta-lokal'],
    tastingNotes: [
      ['Cokelat pahit', 'Bitter chocolate'],
      ['Rempah', 'Spice'],
      ['Kayu', 'Woody']
    ],
    variants: [
      [200, 55000],
      [500, 125000],
      [1000, 230000]
    ]
  }
]

// SKU: KTR-<slug initials>-<weight>. Stable and human-readable, so an admin can
// recognise a variant from the code alone.
const skuFor = (slug: string, weightG: number) => {
  const code = slug
    .split('-')
    .map(part => part.slice(0, 2))
    .join('')
    .toUpperCase()
    .slice(0, 8)

  return `KTR-${code}-${weightG}`
}

async function main() {
  console.log('Seeding Kopi Teduh catalog…')

  // Order matters: children first, so foreign keys never dangle.
  await prisma.productVarietal.deleteMany()
  await prisma.tastingNote.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.varietal.deleteMany()
  await prisma.grindOption.deleteMany()

  for (const varietal of VARIETALS) {
    await prisma.varietal.create({ data: varietal })
  }

  console.log(`  ${VARIETALS.length} varietals`)

  for (const grind of GRIND_OPTIONS) {
    await prisma.grindOption.create({ data: grind })
  }

  console.log(`  ${GRIND_OPTIONS.length} grind options`)

  for (const p of PRODUCTS) {
    const { varietals, tastingNotes, variants, ...product } = p

    await prisma.product.create({
      data: {
        ...product,
        varietals: {
          create: varietals.map(slug => ({
            varietal: { connect: { slug } }
          }))
        },
        tastingNotes: {
          create: tastingNotes.map(([label, labelEn], i) => ({ label, labelEn, sortOrder: i }))
        },
        variants: {
          create: variants.map(([weightG, priceIdr], i) => ({
            weightG,
            priceIdr,
            sku: skuFor(p.slug, weightG),
            isDefault: i === 0,
            sortOrder: i
          }))
        }
      }
    })
  }

  console.log(`  ${PRODUCTS.length} products`)
  console.log('Done.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
