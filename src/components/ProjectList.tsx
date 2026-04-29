'use client'

import {useCallback, useState} from 'react'
import {useRouter} from 'next/navigation'
import {urlFor} from '@/lib/sanity'
import styles from './ProjectList.module.css'

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

interface FeaturedImages {
  primaryImage: number
  images: PositionedImage[]
}

interface Project {
  _id: string
  title: string
  slug: string
  featuredImages?: FeaturedImages
}

interface ProjectListProps {
  projects: Project[]
  onNavigate?: () => void
}

export function ProjectList({projects, onNavigate}: ProjectListProps) {
  if (!projects?.length) return null

  return (
    <div className={styles.projectsList}>
      {projects.map((project) => (
        <ProjectSection key={project._id} project={project} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

function ProjectSection({project, onNavigate}: {project: Project; onNavigate?: () => void}) {
  const router = useRouter()
  const {featuredImages, title, slug} = project

  if (!featuredImages?.images?.length) return null

  const primaryIndex = featuredImages.primaryImage ?? 0

  const handleClick = () => {
    sessionStorage.setItem('scrollPosition', String(window.scrollY))
    onNavigate?.()
    setTimeout(() => {
      router.push(`/projects/${slug}`)
    }, 300)
  }

  return (
    <section className={styles.project}>
      <div className={styles.projectLink} onClick={handleClick}>
        <div className={styles.canvas}>
          {featuredImages.images.map((img, index) => (
            <ProjectImage
              key={img._key}
              img={img}
              title={title}
              isPrimary={index === primaryIndex}
              variant="canvas"
            />
          ))}
        </div>

        <div className={styles.mobileStack}>
          {featuredImages.images.map((img, index) => (
            <ProjectImage
              key={img._key}
              img={img}
              title={title}
              isPrimary={index === 0}
              variant="mobile"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectImage({
  img,
  title,
  isPrimary,
  variant,
}: {
  img: PositionedImage
  title: string
  isPrimary: boolean
  variant: 'canvas' | 'mobile'
}) {
  const [loaded, setLoaded] = useState(false)

  const dims = img.image.asset.metadata?.dimensions
  const aspectRatio = dims && dims.height > 0 ? `${dims.width} / ${dims.height}` : undefined

  const handleRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) {
      el.decode().then(() => setLoaded(true)).catch(() => setLoaded(true))
    }
  }, [])

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget
    el.decode().then(() => setLoaded(true)).catch(() => setLoaded(true))
  }, [])

  const wrapperStyle =
    variant === 'canvas'
      ? {
          left: `${img.x}%`,
          top: `${img.y}%`,
          width: `${img.width}%`,
          zIndex: img.zIndex,
          aspectRatio,
        }
      : undefined

  const imgWidth = variant === 'canvas' ? 1200 : 800
  const imgClassName = `${styles.image} ${loaded ? styles.imageLoaded : ''}`
  const imgStyle = aspectRatio ? {aspectRatio} : undefined

  if (variant === 'canvas') {
    return (
      <div className={styles.imageWrapper} style={wrapperStyle}>
        <img
          ref={handleRef}
          src={urlFor(img.image).width(imgWidth).auto('format').url()}
          alt={img.alt ?? title}
          className={imgClassName}
          onLoad={handleLoad}
          style={imgStyle}
        />
        {isPrimary && title && (
          <span className={styles.projectTitle}>
            {title}
            <span className={styles.arrow}>↗</span>
          </span>
        )}
      </div>
    )
  }

  return (
    <div>
      <img
        ref={handleRef}
        src={urlFor(img.image).width(imgWidth).auto('format').url()}
        alt={img.alt ?? title}
        className={imgClassName}
        onLoad={handleLoad}
        style={imgStyle}
      />
      {isPrimary && title && (
        <span className={styles.projectTitle}>
          {title}
          <span className={styles.arrow}>↗</span>
        </span>
      )}
    </div>
  )
}