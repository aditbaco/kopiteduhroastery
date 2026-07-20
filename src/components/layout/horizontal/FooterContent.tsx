'use client'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Kept in step with the vertical FooterContent — the layout switch must not
// change the footer copy.
const FooterContent = () => {
  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
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
