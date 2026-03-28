import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {CanvasGalleryInput} from './CanvasGalleryInput'

/**
 * gallerySlideType
 *
 * A single slide within a project gallery.
 * Contains 1–3 positioned images on a freeform canvas.
 *
 * Uses CanvasGalleryInput as a custom input component to provide
 * a drag-and-drop canvas editor instead of the default array UI.
 */
export const gallerySlideType = defineType({
  name: 'gallerySlide',
  title: 'Gallery Slide',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'positionedImage'})],
      validation: (rule) => rule.min(1).max(3),
      description: '1–3 images per slide, freely positioned on the canvas.',
    }),
  ],
  components: {
    input: CanvasGalleryInput,
  },
  preview: {
    select: {
      image0: 'images.0.image',
      image1: 'images.1.image',
      image2: 'images.2.image',
      image0Alt: 'images.0.alt',
    },
    prepare({image0, image1, image2, image0Alt}) {
      const count = [image0, image1, image2].filter(Boolean).length
      return {
        title: `${count} image${count !== 1 ? 's' : ''}`,
        subtitle: image0Alt || '',
        media: image0,
      }
    },
  },
})
