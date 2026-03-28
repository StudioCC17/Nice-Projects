import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schemaTypes} from './src/schemaTypes'
import {defaultDocumentNode} from './src/structure/defaultDocumentNode'
import {SINGLETON_TYPES, structure} from './src/structure'

/**
 * Sanity Studio configuration.
 *
 * @see https://www.sanity.io/docs/configuration
 */
export default defineConfig({
  name: 'nice-projects',
  title: 'Nice Projects',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    visionTool({defaultApiVersion: '2024-01-01'}),
  ],

  schema: {
    types: schemaTypes,

    // Prevent singletons from appearing in the "New document" menu
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // Prevent singletons from being duplicated or deleted
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({action}) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
})
