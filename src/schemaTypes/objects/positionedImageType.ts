import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * positionedImageType
 *
 * Core building block for the canvas gallery system.
 * Represents a single image with percentage-based coordinates
 * for freeform positioning on a canvas.
 *
 * Used within both `gallerySlideType` and `featuredImagesType`.
 */
export const positionedImageType = defineType({
  name: 'positionedImage',
  title: 'Positioned Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Accessible description of the image for screen readers and SEO.',
    }),
    defineField({
      name: 'x',
      title: 'X Position (%)',
      type: 'number',
      description: 'Horizontal position as a percentage of the canvas width.',
      initialValue: 10,
      validation: (rule) => rule.min(0).max(100).precision(1),
    }),
    defineField({
      name: 'y',
      title: 'Y Position (%)',
      type: 'number',
      description: 'Vertical position as a percentage of the canvas height.',
      initialValue: 10,
      validation: (rule) => rule.min(0).max(100).precision(1),
    }),
    defineField({
      name: 'width',
      title: 'Width (%)',
      type: 'number',
      description: 'Width as a percentage of the canvas. Height is derived from aspect ratio.',
      initialValue: 40,
      validation: (rule) => rule.min(10).max(100).precision(1),
    }),
    defineField({
      name: 'zIndex',
      title: 'Layer Order',
      type: 'number',
      description: 'Controls stacking order. Higher values appear in front of lower values.',
      initialValue: 1,
      validation: (rule) => rule.min(0).max(10).integer(),
    }),
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'alt',
      x: 'x',
      y: 'y',
      width: 'width',
    },
    prepare({media, alt, x, y, width}) {
      return {
        title: alt || 'Untitled image',
        subtitle: `${x ?? 0}%, ${y ?? 0}% · ${width ?? 40}% wide`,
        media,
      }
    },
  },
})
