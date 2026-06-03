import type {PortableTextComponents} from '@portabletext/react'

/**
 * portableTextComponents
 *
 * Shared serialiser config for all PortableText rendering on the site.
 * Handles the two annotation types declared in `infoSectionType`:
 *
 *  - link:     a standard external / mailto / tel URL
 *  - fileLink: an uploaded file (PDF), used for press downloads
 *
 * The `fileLink` handler expects the file URL to have been resolved in the
 * GROQ query and projected onto the annotation as `url` (see queries note).
 */
export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({value, children}) => {
      const href = value?.href ?? ''
      const isExternal = /^https?:\/\//i.test(href)

      return (
        <a
          href={href}
          {...(isExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      )
    },

    fileLink: ({value, children}) => {
      const href = value?.url

      // No resolved URL (asset missing, or query not yet dereferencing the
      // file): render the text plainly rather than an empty, broken link.
      if (!href) return <>{children}</>

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}