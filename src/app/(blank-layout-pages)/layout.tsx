// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType

const Layout = async (props: Props) => {
  const { children } = props

  // Type guard to ensure lang is a valid Locale

  // Vars
  const direction = 'ltr'
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      {/* Moved down from the root layout, which must stay free of cookies() so
          the storefront can render statically. */}
      <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
      <BlankLayout systemMode={systemMode}>{children}</BlankLayout>
    </Providers>
  )
}

export default Layout
