'use client'

// Next Imports
import Image from 'next/image'

// Third-party Imports
import styled from '@emotion/styled'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

/*
 * The brand art ships in two colourways — dark ink for light backgrounds, white
 * for dark ones. Both are rendered and CSS picks between them rather than
 * choosing `src` from a hook: the mode lives in a cookie the client reads after
 * hydration, so a JS swap would paint the wrong logo first and flash.
 *
 * The hook is `[data-dark]` on <html>, which is what `colorSchemeSelector:
 * 'data'` in components/theme/index.tsx actually emits — not the
 * `data-mui-color-scheme` the MUI docs describe. Verified against the rendered
 * DOM; light mode carries no attribute at all, hence the light-first default.
 *
 * This tracks the *page* scheme, so it would show the wrong colourway under
 * themeConfig.semiDark (dark nav on a light page). semiDark is off.
 */
const Art = styled.span`
  display: inline-flex;
  align-items: center;

  .logo-on-light {
    display: block;
  }
  .logo-on-dark {
    display: none;
  }

  [data-dark] & .logo-on-light {
    display: none;
  }
  [data-dark] & .logo-on-dark {
    display: block;
  }
`

// Intrinsic sizes, read off the files — the two lockup exports were rendered at
// different scales, so they cannot share one width/height pair.
const ART = {
  mark: {
    height: 32,
    onLight: { src: '/images/logo/icon-dark.png', width: 571, height: 596 },
    onDark: { src: '/images/logo/icon-white.png', width: 571, height: 596 }
  },
  lockup: {
    height: 30,
    onLight: { src: '/images/logo/lockup-dark.png', width: 560, height: 173 },
    onDark: { src: '/images/logo/lockup-white.png', width: 720, height: 222 }
  }
} as const

const Logo = () => {
  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  /*
   * The collapsed rail is ~70px wide and the lockup is ~3.2:1, so it cannot fit
   * — the icon mark stands in until the nav expands or the pointer hovers it.
   * On small screens the nav is a full-width drawer, so the lockup fits there
   * regardless of the collapsed setting.
   */
  const compact = !isBreakpointReached && settings.layout === 'collapsed' && !isHovered

  const art = compact ? ART.mark : ART.lockup

  // `sizes` keeps Next from fetching the 3840w srcset candidate for art drawn
  // 30px tall — that stalled the storefront header logo once already.
  return (
    <Art>
      <Image
        {...art.onLight}
        alt='Kopi Teduh Roastery'
        sizes='160px'
        priority
        className='logo-on-light'
        style={{ height: art.height, width: 'auto' }}
      />
      {/* Same alt on both: `display: none` keeps the inactive one out of the
          accessibility tree, so this names the link in dark mode without
          double-announcing in light. */}
      <Image
        {...art.onDark}
        alt='Kopi Teduh Roastery'
        sizes='160px'
        priority
        className='logo-on-dark'
        style={{ height: art.height, width: 'auto' }}
      />
    </Art>
  )
}

export default Logo
