import {StarIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {CanvasFeaturedInput} from './CanvasFeaturedInput'

/**
 * featuredImagesType
 *
 * The homepage composition for a project.
 * Same canvas positioning system as gallery slides, but includes
 * a `primaryImage` field so the editor can choose which image
 * the project title anchors beneath.
 *
 * Uses CanvasFeaturedInput as a custom input component which
 * adds a "Set as primary" button to the controls panel and
 * a green "TITLE" badge on the primary image in the canvas.
 */
export const featuredImagesType = defineType({
  name: 'featuredImages',
  title: 'Featured Images',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'positionedImage'})],
      validation: (rule) => rule.min(1).max(3),
      description: '1–3 images for the homepage layout, freely positioned on the canvas.',
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary Image Index',
      type: 'number',
      description:
        'Which image (0-indexed) the project title should appear beneath. 0 = first image, 1 = second, 2 = third.',
      initialValue: 0,
      validation: (rule) => rule.min(0).max(2).integer(),
    }),
  ],
  components: {
    input: CanvasFeaturedInput as any,
  },
})
