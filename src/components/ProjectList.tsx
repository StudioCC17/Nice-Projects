'use client'

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
            <div
              key={img._key}
              className={styles.imageWrapper}
              style={{
                left: `${img.x}%`,
                top: `${img.y}%`,
                width: `${img.width}%`,
                zIndex: img.zIndex,
              }}
            >
              <img
                src={urlFor(img.image).width(1200).auto('format').url()}
                alt={img.alt ?? title}
                className={styles.image}
              />
              {index === primaryIndex && title && (
                <span className={styles.projectTitle}>
                  {title}
                  <span className={styles.arrow}>↗</span>
                </span>
              )}
            </div>
          ))}
        </div>

       <div className={styles.mobileStack}>
          {featuredImages.images.map((img, index) => (
            <div key={img._key}>
              <img
                src={urlFor(img.image).width(800).auto('format').url()}
                alt={img.alt ?? title}
                className={styles.image}
              />
              {index === 0 && title && (
                <span className={styles.projectTitle}>
                  {title}
                  <span className={styles.arrow}>↗</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
