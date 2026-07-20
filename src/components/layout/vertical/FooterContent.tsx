'use client'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Mirrors the bottom strip of components/storefront/Footer.tsx so the admin
// reads as the same product, not the template it was scaffolded from.
const FooterContent = () => {
  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p className='text-textSecondary'>
        {`© ${new Date().getFullYear()} Kopi Teduh Roastery — Poso, Sulawesi Tengah`}
      </p>
      <a href='https://dekate.id' target='_blank' rel='noopener noreferrer' className='text-textSecondary'>
        Powered by dekate
      </a>
    </div>
  )
}

export default FooterContent
