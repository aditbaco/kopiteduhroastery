// Auth Imports
import { requireAdminSession } from '@/libs/admin/auth/guard'

// Lib Imports
import { listVarietalsForAdmin } from '@/libs/admin/varietals/read'

// View Imports
import SettingsView from '@/views/admin/settings/SettingsView'

const AdminSettingsPage = async () => {
  // src/proxy.ts already gates /admin/:path*; this is the same defense in depth
  // the product pages get, because a matcher is one typo away from letting
  // reads through.
  await requireAdminSession()

  const varietals = await listVarietalsForAdmin()

  return <SettingsView varietals={varietals} />
}

export default AdminSettingsPage
