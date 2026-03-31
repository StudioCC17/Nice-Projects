'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import Image from 'next/image'
import styles from './LandingSplash.module.css'

interface LandingSplashProps {
  logoUrl: string
  logoMobileUrl?: string
  images: Array<{
    asset: {
      _id: string
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
  }>
  onLogoShrunk: () => void
  onScrolledPast: () => void
  onStudioClick: () => void
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function LandingSplash({logoUrl, logoMobileUrl, images, onLogoShrunk, onScrolledPast, onStudioClick}: LandingSplashProps) {
  const [logoShrunk, setLogoShrunk] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasTriggered = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const randomImage = useMemo(() => {
    if (!images?.length) return null
    return images[Math.floor(Math.random() * images.length)]
  }, [images])

  // Desktop: 20-40vw, Mobile: 55-75vw
const [randomLayout, setRandomLayout] = useState<{width: number, top: number, left: number} | null>(null)

  useEffect(() => {
    const mobile = window.innerWidth <= 1024
    const width = mobile ? randomBetween(40, 80) : randomBetween(30, 55)
    const top = mobile ? randomBetween(5, 40) : randomBetween(3, 30)
    const left = mobile ? randomBetween(3, 95 - width) : randomBetween(0, 95 - width)
    setRandomLayout({width, top, left})
  }, [])

  const triggerShrink = useCallback(() => {
    if (hasTriggered.current) return
    hasTriggered.current = true
    setLogoShrunk(true)
    onLogoShrunk()
  }, [onLogoShrunk])

  const handleClick = useCallback(() => {
    triggerShrink()
    if (sectionRef.current) {
      const sectionHeight = sectionRef.current.offsetHeight
      window.scrollTo({
        top: sectionHeight,
        behavior: 'smooth',
      })
    }
  }, [triggerShrink])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        triggerShrink()
      }

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.bottom < 0) {
          onScrolledPast()
        }
      }
    }

    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggerShrink, onScrolledPast])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) triggerShrink()
    }

    window.addEventListener('wheel', handleWheel, {passive: true})
    return () => window.removeEventListener('wheel', handleWheel)
  }, [triggerShrink])

  useEffect(() => {
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY - e.touches[0].clientY > 30) triggerShrink()
    }

    window.addEventListener('touchstart', handleTouchStart, {passive: true})
    window.addEventListener('touchmove', handleTouchMove, {passive: true})
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [triggerShrink])

  return (
    <>
      <div ref={sectionRef} className={styles.splash} onClick={handleClick}>
       {randomImage && randomLayout && (
          <div
            className={styles.imageWrapper}
            style={{
              position: 'absolute',
              width: `${randomLayout.width}vw`,
              top: `${randomLayout.top}vh`,
              left: `${randomLayout.left}vw`,
            }}
          >
            <img
              src={`${randomImage.asset.url}?w=1200&auto=format`}
              alt=""
              className={styles.image}
            />
          </div>
        )}
      </div>

      <div className={`${styles.logoWrapper} ${logoShrunk ? styles.logoShrunk : ''}`}>
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Nice Projects"
            width={1200}
            height={200}
            className={`${styles.logo} ${styles.desktopLogo}`}
            priority
          />
        )}
        {(logoMobileUrl || logoUrl) && (
          <Image
            src={logoMobileUrl || logoUrl}
            alt="Nice Projects"
            width={1200}
            height={200}
            className={`${styles.logo} ${styles.mobileLogo}`}
            priority
          />
        )}
      </div>

      <nav className={styles.splashNav}>
        <button type="button" className={styles.splashNavButton} onClick={onStudioClick}>
          Studio
        </button>
      </nav>
    </>
  )
}