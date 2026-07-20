import 'server-only'

// Next Imports
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Config Imports
import { ADMIN_SESSION_COOKIE } from './config'

// Session Imports
import { verifySessionValue } from './session'

// proxy.ts already gates /admin/*, but every mutating action calls this too:
// a Server Action is a POST endpoint that can be invoked directly, and route
// matchers are easy to get wrong. Defense in depth, one line per action.
export const requireAdminSession = async (): Promise<void> => {
  const store = await cookies()

  if (!verifySessionValue(store.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect('/login')
  }
}
