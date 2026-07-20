// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

// Keep in sync with verticalMenuData.tsx.
const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Produk',
    href: '/admin/products',
    icon: 'tabler-coffee'
  },
  {
    label: 'Pengaturan',
    href: '/admin/settings',
    icon: 'tabler-settings'
  }
]

export default horizontalMenuData
