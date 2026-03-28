import {notFound} from 'next/navigation'

import {client} from '@/lib/sanity'
import {PROJECT_QUERY, PROJECT_SLUGS_QUERY, HOMEPAGE_QUERY} from '@/lib/queries'
import {ProjectGallery} from '@/components/ProjectGallery'

/**
 * Project page (Server Component)
 *
 * Dynamic route: /projects/[slug]
 * Fetches the project data and the list of all project slugs
 * (for "Next Project" navigation), then renders the gallery.
 */

interface ProjectPageProps {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch(PROJECT_SLUGS_QUERY)
  return slugs.map((s: {slug: string}) => ({slug: s.slug}))
}

export default async function ProjectPage({params}: ProjectPageProps) {
  const {slug} = await params

  const [project, allProjects] = await Promise.all([
    client.fetch(PROJECT_QUERY, {slug}),
    client.fetch(HOMEPAGE_QUERY),
  ])

  if (!project) notFound()

  // Build next project link
  const projectSlugs = allProjects.map((p: any) => p.slug)
  const currentIndex = projectSlugs.indexOf(slug)
  const nextSlug =
    currentIndex !== -1 && currentIndex < projectSlugs.length - 1
      ? projectSlugs[currentIndex + 1]
      : projectSlugs[0]
  const nextProject = allProjects.find((p: any) => p.slug === nextSlug)

  return (
    <ProjectGallery
      project={project}
      nextProject={nextProject ? {title: nextProject.title, slug: nextProject.slug} : null}
    />
  )
}
