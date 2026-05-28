import {notFound} from 'next/navigation'

import {client, sanityFetch} from '@/lib/sanity'
import {PROJECT_QUERY, PROJECT_SLUGS_QUERY, HOMEPAGE_QUERY} from '@/lib/queries'
import {ProjectGallery} from '@/components/ProjectGallery'

export const dynamic = 'force-dynamic'

interface ProjectPageProps {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await client.fetch(PROJECT_SLUGS_QUERY)
  return slugs.map((s: {slug: string}) => ({slug: s.slug}))
}

export default async function ProjectPage({params}: ProjectPageProps) {
  const {slug} = await params

  const [{data: project}, {data: allProjects}] = await Promise.all([
    sanityFetch({query: PROJECT_QUERY, params: {slug}}),
    sanityFetch({query: HOMEPAGE_QUERY}),
  ])

  if (!project) notFound()

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