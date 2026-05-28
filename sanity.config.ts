import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool, defineLocations} from 'sanity/presentation'

import {schemaTypes} from './src/schemaTypes'
import {defaultDocumentNode} from './src/structure/defaultDocumentNode'
import {SINGLETON_TYPES, structure} from './src/structure'

export default defineConfig({
  name: 'nice-projects',
  title: 'Nice Projects',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    presentationTool({
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? 'https://nice-projects.vercel.app'
            : location.origin,
        draftMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        locations: {
          project: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/projects/${doc?.slug}`,
                },
                {title: 'Home', href: '/'},
              ],
            }),
          }),
          siteSettings: defineLocations({
            locations: [{title: 'Home', href: '/'}],
          }),
          studioInfo: defineLocations({
            locations: [{title: 'Home', href: '/'}],
          }),
        },
      },
    }),
    visionTool({defaultApiVersion: '2024-01-01'}),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({action}) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
})