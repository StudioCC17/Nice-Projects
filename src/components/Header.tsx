'use client'

import {useCallback, useEffect, useState} from 'react'
import Image from 'next/image'
import styles from './Header.module.css'

interface HeaderProps {
  logoUrl?: string
  logoMobileUrl?: string
  isStudioView: boolean
  onToggleView: () => void
  isNavigating?: boolean
  shouldFade?: boolean
}

export function Header({
  logoUrl,
  logoMobileUrl,
  isStudioView,
  onToggleView,
  isNavigating,
  shouldFade = false,
}: HeaderProps) {
  const [logoLoaded, setLogoLoaded] = useState(false)
  // If we're not supposed to fade, treat as already-faded-in immediately.
  const [hasFadedIn, setHasFadedIn] = useState(!shouldFade)

  useEffect(() => {
    if (!shouldFade) return
    if (logoLoaded && !hasFadedIn) {
      const t = setTimeout(() => setHasFadedIn(true), 500)
      return () => clearTimeout(t)
    }
  }, [logoLoaded, hasFadedIn, shouldFade])

  const handleLogoRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) {
      el.decode().then(() => setLogoLoaded(true)).catch(() => setLogoLoaded(true))
    }
  }, [])

  const handleLogoLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.decode().then(() => setLogoLoaded(true)).catch(() => setLogoLoaded(true))
  }, [])

  // Opacity logic:
  // - Navigating away: 0 (with transition for fade-out)
  // - shouldFade is false: always 1, no transition (instant appearance)
  // - shouldFade is true and not yet loaded: 0
  // - shouldFade is true and loaded: 1 (with transition for fade-in)
  // - hasFadedIn: locked at 1, no transition
  let opacity: number
  let transition: string

  if (isNavigating) {
    opacity = 0
    transition = 'opacity 0.3s ease-in-out'
  } else if (!shouldFade || hasFadedIn) {
    opacity = 1
    transition = 'none'
  } else {
    opacity = logoLoaded ? 1 : 0
    transition = 'opacity 0.4s ease-in-out'
  }

  return (
    <header
      className={styles.header}
      style={{opacity, transition}}
    >
      <div className={styles.logoContainer}>
        {logoUrl && (
          <Image
            ref={handleLogoRef}
            src={logoUrl}
            alt="Nice Projects"
            width={600}
            height={100}
            className={`${styles.logo} ${styles.desktopLogo}`}
            priority
            onLoad={handleLogoLoad}
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            style={{cursor: 'pointer'}}
          />
        )}
        {(logoMobileUrl || logoUrl) && (
          <Image
            ref={handleLogoRef}
            src={logoMobileUrl || logoUrl!}
            alt="Nice Projects"
            width={600}
            height={100}
            className={`${styles.logo} ${styles.mobileLogo}`}
            priority
            onLoad={handleLogoLoad}
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