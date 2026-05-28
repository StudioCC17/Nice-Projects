import {createClient} from 'next-sanity'
import {defineLive} from 'next-sanity/live'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = '2024-01-01'
const token = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: {
    studioUrl: '/studio',
  },
})

export function getClient(isDraftMode: boolean) {
  if (isDraftMode) {
    if (!token) {
      throw new Error('SANITY_API_READ_TOKEN is required for draft mode')
    }
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: 'drafts',
      token,
      stega: {studioUrl: '/studio'},
    })
  }
  return client
}

export const {sanityFetch, SanityLive} = defineLive({
  client: client.withConfig({apiVersion: 'vX'}),
  serverToken: token,
  browserToken: token,
})