'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import {urlFor} from '@/lib/sanity'
import styles from './ProjectGallery.module.css'

interface PositionedImage {
  _key: string
  image: {
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
  }
  alt?: string
  x: number
  y: number
  width: number
  zIndex: number
}

interface GallerySlide {
  _key: string
  images: PositionedImage[]
}

interface PressItem {
  _key: string
  publication: string
  url?: string
}

interface Project {
  _id: string
  title: string
  slug: string
  description?: any[]
  photographer?: string
  press?: PressItem[]
  gallery?: GallerySlide[]
}

interface NextProject {
  title: string
  slug: string
}

interface ProjectGalleryProps {
  project: Project
  nextProject: NextProject | null
}

const FADE_DURATION = 200
const FADE_STAGGER = 280

export function ProjectGallery({project, nextProject}: ProjectGalleryProps) {
  const router = useRouter()
  const {title, gallery, description, photographer, press} = project
  const slides = gallery ?? []
  const totalSlides = slides.length

  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleSlide, setVisibleSlide] = useState(0)
  const [showDescription, setShowDescription] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [showInfoOverlay, setShowInfoOverlay] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [slidePhase, setSlidePhase] = useState<'in' | 'out' | 'idle'>('in')
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  const transitionTimeouts = useRef<NodeJS.Timeout[]>([])
  const hasNavigated = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const clearTimeouts = useCallback(() => {
    transitionTimeouts.current.forEach(clearTimeout)
    transitionTimeouts.current = []
  }, [])

  const fadeImagesIn = useCallback(
    (slideIndex: number) => {
      const imageCount = slides[slideIndex]?.images?.length ?? 0
      setVisibleImages(new Set())
      setVisibleSlide(slideIndex)
      setSlidePhase('in')

      const initialDelay = slideIndex === 0 && !hasNavigated.current
        ? (isMobile ? 2500 : 1000)
        : 50

      for (let i = 0; i < imageCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleImages((prev) => new Set([...prev, i]))
        }, i * FADE_STAGGER + initialDelay)
        transitionTimeouts.current.push(timeout)
      }

      if (slideIndex === 0 && !hasNavigated.current) {
        const navTimeout = setTimeout(() => {
          setShowNav(true)
        }, initialDelay)
        transitionTimeouts.current.push(navTimeout)
      }

      if (slideIndex === 0) {
        const descTimeout = setTimeout(() => {
          setShowDescription(true)
        }, initialDelay)
        transitionTimeouts.current.push(descTimeout)
      }

      const doneTimeout = setTimeout(() => {
        setIsTransitioning(false)
      }, imageCount * FADE_STAGGER + FADE_DURATION + initialDelay)
      transitionTimeouts.current.push(doneTimeout)
    },
    [slides, isMobile],
  )

  const transitionToSlide = useCallback(
    (nextSlideIndex: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      clearTimeouts()

      setSlidePhase('out')
      setVisibleImages(new Set())

      const outDuration = FADE_DURATION
      const switchTimeout = setTimeout(() => {
        setCurrentSlide(nextSlideIndex)
        fadeImagesIn(nextSlideIndex)
      }, outDuration)
      transitionTimeouts.current.push(switchTimeout)
    },
    [isTransitioning, clearTimeouts, fadeImagesIn],
  )

  const exitGallery = useCallback(
    (destination: string) => {
      if (isExiting) return
      setIsExiting(true)
      setTimeout(() => {
        router.push(destination)
      }, 300)
    },
    [isExiting, router],
  )

  useEffect(() => {
    fadeImagesIn(0)
    return clearTimeouts
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTitle(true)
    }, 50)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setShowNav(true)
      return
    }
    const timeout = setTimeout(() => {
      setShowTitle(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [isMobile])

  const goToNext = useCallback(() => {
    if (isTransitioning || isExiting) return
    setShowTitle(false)
    setShowDescription(false)
    hasNavigated.current = true
    const nextSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0
    if (nextSlide === 0) {
      setShowDescription(true)
    }
    transitionToSlide(nextSlide)
  }, [currentSlide, totalSlides, isTransitioning, isExiting, transitionToSlide])

  const goToPrev = useCallback(() => {
    if (currentSlide > 0 && !isTransitioning && !isExiting) {
      setShowTitle(false)
      hasNavigated.current = true
      transitionToSlide(currentSlide - 1)
      if (currentSlide - 1 === 0) {
        setShowDescription(true)
      }
    }
  }, [currentSlide, isTransitioning, isExiting, transitionToSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showInfoOverlay) {
        if (e.key === 'Escape') setShowInfoOverlay(false)
        return
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goToNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      }
      if (e.key === 'Escape') {
        exitGallery('/')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev, exitGallery, showInfoOverlay])

  useEffect(() => {
    const nextIndex = currentSlide + 1
    if (nextIndex >= totalSlides) return

    const nextSlide = slides[nextIndex]
    if (!nextSlide?.images) return

    nextSlide.images.forEach((img) => {
      if (img.image?.asset) {
        const desktop = new Image()
        desktop.src = urlFor(img.image).width(1400).auto('format').url()
        const mobile = new Image()
        mobile.src = urlFor(img.image).width(800).auto('format').url()
      }
    })
  }, [currentSlide, totalSlides, slides])

  const handleGalleryClick = useCallback(
    (e: React.MouseEvent) => {
      if (showInfoOverlay) return
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const halfWidth = rect.width / 2

      if (clickX < halfWidth) {
        goToPrev()
      } else {
        goToNext()
      }
    },
    [goToNext, goToPrev, showInfoOverlay],
  )

  if (totalSlides === 0) {
    return (
      <div className={styles.empty}>
        <p>No gallery slides yet.</p>
        <Link href="/">Back to work</Link>
      </div>
    )
  }

  const activeSlide = slides[visibleSlide]
  const hasInfo = (description && description.length > 0) || (press && press.length > 0)
  const topBarHidden = !isMobile && currentSlide === 0

  return (
    <div className={`${styles.gallery} ${isExiting ? styles.galleryExiting : ''}`}>
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className={`${styles.topBar} ${topBarHidden ? styles.hiddenFade : ''} ${isMobile && !showNav ? styles.hiddenFade : ''}`}>
        <div className={styles.topBarTitle}>
          <span className={styles.titleText}>{title}</span>
        </div>
        <div className={styles.topBarRight}>
          {!isMobile && nextProject && (
            <button onClick={() => exitGallery(`/projects/${nextProject.slug}`)} className={styles.topBarLink}>Next Project</button>
          )}
          <button onClick={() => exitGallery('/')} className={styles.topBarLink}>Close</button>
        </div>
      </header>

      {/* ── Slide Area ──────────────────────────────────────── */}
      <div className={styles.slideArea} onClick={handleGalleryClick}>
        <div className={`${styles.titleSplash} ${showTitle ? styles.titleVisible : styles.titleHidden}`}>
          <h3 className={styles.titleSplashText}>{title}</h3>
        </div>

        <div className={`${styles.cursorZone} ${styles.cursorLeft} ${currentSlide === 0 ? styles.cursorHidden : ''}`} />
        <div className={`${styles.cursorZone} ${styles.cursorRight}`} />

        {activeSlide && (
          <>
            <div className={styles.slideCanvas}>
              {activeSlide.images.map((img, imgIndex) => (
                <div
                  key={img._key}
                  className={`${styles.slideImageWrapper} ${visibleImages.has(imgIndex) ? styles.imageVisible : styles.imageHidden}`}
                  style={{
                    left: `${img.x}%`,
                    top: `${img.y}%`,
                    width: `${img.width}%`,
                    zIndex: img.zIndex,
                  }}
                >
                  <img
                    src={urlFor(img.image).width(1400).auto('format').url()}
                    alt={img.alt ?? title}
                    className={styles.slideImage}
                  />
                  {visibleSlide === 0 && imgIndex === 0 && photographer && (
                    <p className={styles.photoCredit}>Photography by {photographer}</p>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.slideMobile} data-slide={visibleSlide % 6}>
              {activeSlide.images.map((img, imgIndex) => (
                <div
                  key={img._key}
                  className={`${visibleImages.has(imgIndex) ? styles.imageVisible : styles.imageHidden}`}
                >
                  <img
                    src={urlFor(img.image).width(800).auto('format').url()}
                    alt={img.alt ?? title}
                    className={styles.slideImage}
                  />
                  {visibleSlide === 0 && imgIndex === 0 && photographer && (
                    <p className={styles.photoCredit}>Photography by {photographer}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <footer className={`${styles.bottomBar} ${isMobile && !showNav ? styles.hiddenFade : ''}`}>
        <div className={`${styles.descriptionArea} ${currentSlide === 0 && showDescription ? styles.visible : styles.hiddenFade}`}>
          {description && (
            <div className={styles.description}>
              <PortableText value={description} />
            </div>
          )}
          {press && press.length > 0 && (
            <div className={styles.press}>
              <span className={styles.pressLabel}>Press: </span>
              {press.map((item, index) => (
                <span key={item._key}>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.pressLink}>{item.publication}</a>
                  ) : (
                    <span className={styles.pressItem}>{item.publication}</span>
                  )}
                  {index < press.length - 1 && (
                    <span className={styles.pressDivider}> / </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {isMobile && (
          <div className={styles.mobileBottomLeft}>
            {nextProject && (
              <button onClick={() => exitGallery(`/projects/${nextProject.slug}`)} className={styles.topBarLink}>Next Project</button>
            )}
            {hasInfo && (
              <button onClick={() => setShowInfoOverlay(true)} className={styles.topBarLink}>Info</button>
            )}
          </div>
        )}

        <div className={styles.slideCounter}>
          {currentSlide + 1}/{totalSlides}
        </div>
      </footer>

      {/* ── Info Overlay ────────────────────────────────────── */}
      {showInfoOverlay && (
        <div className={styles.infoOverlay}>
          <div className={styles.infoOverlayHeader}>
            <span className={styles.infoOverlayTitle}>{title}</span>
            <button onClick={() => setShowInfoOverlay(false)} className={styles.infoOverlayClose}>Close</button>
          </div>
          <div className={styles.infoOverlayContent}>
            {description && (
              <div className={styles.infoOverlayDescription}>
                <PortableText value={description} />
              </div>
            )}
            {photographer && (
              <p className={styles.infoOverlayCredit}>Photography by {photographer}</p>
            )}
            {press && press.length > 0 && (
              <div className={styles.infoOverlayPress}>
                <span className={styles.pressLabel}>Press: </span>
                {press.map((item, index) => (
                  <span key={item._key}>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.pressLink}>{item.publication}</a>
                    ) : (
                      <span className={styles.pressItem}>{item.publication}</span>
                    )}
                    {index < press.length - 1 && (
                      <span className={styles.pressDivider}> / </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}