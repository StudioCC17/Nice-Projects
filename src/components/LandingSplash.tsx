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
  const [imageLoaded, setImageLoaded] = useState(false)
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

const [randomLayout, setRandomLayout] = useState<{
    width: number
    top: number
    left: number
  } | null>(null)

  useEffect(() => {
    if (!randomImage) return

    const mobile = window.innerWidth <= 1024
    const vwToVh = window.innerWidth / window.innerHeight

    const dims = randomImage.asset.metadata?.dimensions
    const imgAspect = dims && dims.height > 0 ? dims.width / dims.height : 1

    const padX = 3
    const padY = 5

    const minW = mobile ? 45 : 25
    const maxW = mobile ? 80 : 60

    let width = randomBetween(minW, maxW)
    let heightVh = (width / imgAspect) * vwToVh
    const maxHeightVh = 100 - padY * 2

    if (heightVh > maxHeightVh) {
      const widthCeiling = (maxHeightVh / vwToVh) * imgAspect
      const safeMax = Math.max(minW, Math.min(maxW, widthCeiling))
      width = randomBetween(minW, safeMax)
      heightVh = (width / imgAspect) * vwToVh
    }

    const maxLeft = 100 - width - padX
    const maxTop = 100 - heightVh - padY

    const left = randomBetween(padX, Math.max(padX, maxLeft))
    const top = randomBetween(padY, Math.max(padY, maxTop))

    setRandomLayout({width, top, left})
  }, [randomImage])

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
            className={`${styles.imageWrapper} ${imageLoaded ? styles.imageLoaded : ''}`}
            style={{
              position: 'absolute',
              width: `${randomLayout.width}vw`,
              top: `${randomLayout.top}vh`,
              left: `${randomLayout.left}vw`,
            }}
          >
            <img
              ref={(el) => {
                if (el?.complete && el.naturalWidth > 0) {
                  el.decode().then(() => setImageLoaded(true)).catch(() => setImageLoaded(true))
                }
              }}
              src={`${randomImage.asset.url}?w=1200&auto=format`}
              alt=""
              className={styles.image}
              onLoad={(e) => {
                const img = e.currentTarget
                img.decode().then(() => setImageLoaded(true)).catch(() => setImageLoaded(true))
              }}
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