// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

// Keep in sync with horizontalMenuData.tsx.
const verticalMenuData = (): VerticalMenuDataType[] => [
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

export default verticalMenuData
