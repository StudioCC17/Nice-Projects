import {createClient} from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

/**
 * Sanity client instance.
 *
 * Used for fetching data in Next.js server components and
 * API routes. Uses CDN for production reads.
 *
 * @see https://www.sanity.io/docs/js-client
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

/**
 * Image URL builder.
 *
 * Generates optimised image URLs from Sanity image references.
 * Sanity automatically serves the best format (WebP/AVIF) based
 * on browser capabilities when using `auto('format')`.
 *
 * Usage:
 *   urlFor(image).width(800).auto('format').url()
 *
 * @see https://www.sanity.io/docs/image-url
 */
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
