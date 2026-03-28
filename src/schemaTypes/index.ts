import type {SchemaTypeDefinition} from 'sanity'

import {projectType} from './documents'
import {
  featuredImagesType,
  gallerySlideType,
  infoSectionType,
  positionedImageType,
  pressItemType,
} from './objects'
import {siteSettingsType, studioInfoType} from './singletons'

/**
 * All schema types registered with the Sanity Studio.
 *
 * Order: objects (dependencies) → singletons → documents.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Object types
  positionedImageType,
  gallerySlideType,
  featuredImagesType,
  infoSectionType,
  pressItemType,

  // Singleton documents
  siteSettingsType,
  studioInfoType,

  // Collection documents
  projectType,
]
