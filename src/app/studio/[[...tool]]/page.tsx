'use client'

/**
 * Sanity Studio route.
 * All routes under /studio are handled by this catch-all.
 *
 * @see https://github.com/sanity-io/next-sanity
 */
import {NextStudio} from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
