import {sanityFetch} from '@/lib/sanity'
import {HOMEPAGE_QUERY, SETTINGS_QUERY, STUDIO_QUERY} from '@/lib/queries'
import {HomeClient} from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [{data: settings}, {data: projects}, {data: studio}] = await Promise.all([
    sanityFetch({query: SETTINGS_QUERY}),
    sanityFetch({query: HOMEPAGE_QUERY}),
    sanityFetch({query: STUDIO_QUERY}),
  ])

  return <HomeClient settings={settings} projects={projects} studio={studio} />
}