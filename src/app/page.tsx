import {client} from '@/lib/sanity'
import {HOMEPAGE_QUERY, SETTINGS_QUERY, STUDIO_QUERY} from '@/lib/queries'
import {HomeClient} from '@/components/HomeClient'

/**
 * Homepage (Server Component)
 *
 * Fetches site settings, studio info, and projects from Sanity,
 * then passes them to the client-side HomeClient which handles
 * the Studio/Work toggle and rendering.
 */
export default async function HomePage() {
  const [settings, projects, studio] = await Promise.all([
    client.fetch(SETTINGS_QUERY),
    client.fetch(HOMEPAGE_QUERY),
    client.fetch(STUDIO_QUERY),
  ])

  return <HomeClient settings={settings} projects={projects} studio={studio} />
}
