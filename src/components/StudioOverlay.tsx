'use client'

import {PortableText} from '@portabletext/react'
import {urlFor} from '@/lib/sanity'
import styles from './StudioOverlay.module.css'

interface InfoSection {
  _key: string
  title: string
  content?: any[]
}

interface StudioData {
  headline?: string
  description?: any[]
  studioImage?: any
  studioImageCaption?: string
  sections?: InfoSection[]
  footerLocations?: string
  email?: string
  instagramUrl?: string
}

interface StudioOverlayProps {
  studio: StudioData
}

export function StudioOverlay({studio}: StudioOverlayProps) {
  const {
    headline,
    description,
    studioImage,
    studioImageCaption,
    sections,
    footerLocations,
    email,
    instagramUrl,
  } = studio

  const hasStudioImage = !!(
    studioImage?.asset?._id ||
    studioImage?.asset?.url ||
    studioImage?.asset?._ref
  )

  const studioImageUrl = hasStudioImage
    ? studioImage.asset?.url
      ? `${studioImage.asset.url}?w=800&auto=format`
      : urlFor(studioImage).width(800).auto('format').url()
    : null

  return (
    <div className={styles.overlay}>
      <div className={styles.topSection}>
        <div className={styles.blurb}>
          {headline && <h2 className={styles.headline}>{headline}</h2>}
          {description && (
            <div className={styles.description}>
              <PortableText value={description} />
            </div>
          )}
        </div>
        <div className={styles.studioImageCol}>
          {studioImageUrl && (
            <>
              <img
                src={studioImageUrl}
                alt={studioImageCaption ?? 'Studio'}
                className={styles.image}
              />
              {studioImageCaption && (
                <p className={styles.caption}>{studioImageCaption}</p>
              )}
            </>
          )}
        </div>
      </div>

      {sections && sections.length > 0 && (
        <div className={styles.infoGrid}>
          {sections.map((section) => (
            <div key={section._key} className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.content && (
                <div className={styles.sectionContent}>
                  <PortableText value={section.content} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(footerLocations || email || instagramUrl) && (
        <footer className={styles.footer}>
          {footerLocations && (
            <span className={styles.footerItem}>{footerLocations}</span>
          )}
          {email && (
            <a href={`mailto:${email}`} className={styles.footerLink}>{email}</a>
          )}
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Instagram</a>
          )}
        </footer>
      )}
    </div>
  )
}
