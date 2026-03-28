'use client'

import Image from 'next/image'
import styles from './Header.module.css'

interface HeaderProps {
  logoUrl?: string
  logoMobileUrl?: string
  isStudioView: boolean
  onToggleView: () => void
  isNavigating?: boolean
}

export function Header({logoUrl, logoMobileUrl, isStudioView, onToggleView, isNavigating}: HeaderProps) {
  return (
    <header
      className={styles.header}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isNavigating ? 0 : 1,
      }}
    >
      <div className={styles.logoContainer}>
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Nice Projects"
            width={600}
            height={100}
            className={`${styles.logo} ${styles.desktopLogo}`}
            priority
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            style={{cursor: 'pointer'}}
          />
        )}
        {(logoMobileUrl || logoUrl) && (
          <Image
            src={logoMobileUrl || logoUrl!}
            alt="Nice Projects"
            width={600}
            height={100}
            className={`${styles.logo} ${styles.mobileLogo}`}
            priority
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            style={{cursor: 'pointer'}}
          />
        )}
      </div>
      <nav className={styles.nav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={onToggleView}
        >
          {isStudioView ? 'Work' : 'Studio'}
        </button>
      </nav>
    </header>
  )
}