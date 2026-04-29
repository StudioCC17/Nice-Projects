'use client'

import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Header} from '@/components/Header'
import {LandingSplash} from '@/components/LandingSplash'
import {ProjectList} from '@/components/ProjectList'
import {StudioOverlay} from '@/components/StudioOverlay'
import styles from './HomeClient.module.css'

interface HomeClientProps {
  settings: any
  projects: any[]
  studio: any
}

function isReturningFromGallery(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('scrollPosition') !== null
}

export function HomeClient({settings, projects, studio}: HomeClientProps) {
  const returning = useRef(isReturningFromGallery())

  const [isStudioView, setIsStudioView] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [splashActive, setSplashActive] = useState(!returning.current)
  const [isReturningFade, setIsReturningFade] = useState(returning.current)

  const scrollBeforeStudio = useRef(0)

  const logoUrl = settings?.logo?.asset?.url
  const logoMobileUrl = settings?.logoMobile?.asset?.url
  const landingImages = settings?.landingImages
  const hasSplash = logoUrl && landingImages?.length > 0

  useLayoutEffect(() => {
    if (!returning.current) return

    const saved = sessionStorage.getItem('scrollPosition')
    if (!saved) return

    const scrollY = parseInt(saved, 10)
    sessionStorage.removeItem('scrollPosition')
    window.scrollTo(0, scrollY)
  }, [])

  useEffect(() => {
    if (!returning.current) return
    // Wait one paint at opacity: 0, then flip to opacity: 1 so the transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReturningFade(false))
    })
  }, [])

  const handleToggleView = () => {
    if (!isStudioView) {
      scrollBeforeStudio.current = window.scrollY
      window.scrollTo(0, 0)
    }
    setIsStudioView((prev) => !prev)
  }

  useEffect(() => {
    if (!isStudioView && scrollBeforeStudio.current > 0) {
      window.scrollTo({top: scrollBeforeStudio.current, behavior: 'instant'})
    }
  }, [isStudioView])

const showHeader = !hasSplash || !splashActive
const shouldFadeHeader = returning.current

return (
  <>
    {showHeader && (
      <Header
        logoUrl={logoUrl}
        logoMobileUrl={logoMobileUrl}
        isStudioView={isStudioView}
        onToggleView={handleToggleView}
        isNavigating={isNavigating}
        shouldFade={shouldFadeHeader}
      />
    )}

      <main className={styles.main}>
        <div
          className={`${styles.workView} ${isStudioView ? styles.hidden : ''} ${isNavigating ? styles.fadeOut : ''} ${isReturningFade ? styles.returning : ''}`}
        >
          {hasSplash && splashActive && (
            <LandingSplash
              logoUrl={logoUrl}
              logoMobileUrl={logoMobileUrl}
              images={landingImages}
              onLogoShrunk={() => {}}
              onScrolledPast={() => {}}
              onStudioClick={() => {
                setSplashActive(false)
                setIsStudioView(true)
              }}
            />
          )}

          <ProjectList projects={projects} onNavigate={() => setIsNavigating(true)} />
        </div>

        <div
          className={`${styles.studioOverlay} ${isStudioView ? styles.active : ''}`}
        >
          {studio && <StudioOverlay studio={studio} />}
        </div>
      </main>
    </>
  )
}