import type { MetadataRoute } from 'next'

import { LANGS } from '@/dictionaries'
import { getProducts } from '@/libs/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Fetch all active products
  const products = await getProducts()

  // Define static routes inside the [lang] scope
  const staticRoutes = [
    '',
    '/koleksi',
    '/tentang',
    '/kontak',
    '/syarat-ketentuan',
    '/kebijakan-privasi',
    '/panduan-berbelanja',
    '/keranjang'
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for each language
  for (const lang of LANGS) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8
      })
    }

    // Add dynamic product routes for each language
    for (const product of products) {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/kopi/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9
      })
    }
  }

  return sitemapEntries
}
