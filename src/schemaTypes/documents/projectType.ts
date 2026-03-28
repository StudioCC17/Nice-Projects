import {CaseIcon, ComposeIcon, ImageIcon, TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * projectType
 *
 * The primary content document. Each project contains:
 * - Basic info (title, slug, description)
 * - Featured images for the homepage (canvas-positioned, 1–3, with primary flag)
 * - Gallery slides (repeater with freeform canvas positioning)
 * - Press credits (per-project)
 * - Photographer credit
 * - Display order for homepage sequencing
 *
 * Field groups organise the editing experience:
 * - Content: title, slug, description, photographer
 * - Gallery: featured images + gallery slides
 * - Meta: press credits, display order
 */
export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {
      name: 'content',
      title: 'Content',
      icon: ComposeIcon,
      default: true,
    },
    {
      name: 'gallery',
      title: 'Gallery',
      icon: ImageIcon,
    },
    {
      name: 'meta',
      title: 'Meta',
      icon: TagIcon,
    },
  ],
  fields: [
    // ── Content group ──────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'content',
      description: 'The name of the project as it appears on the site.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'URL-friendly identifier. Click "Generate" to create from title.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'block'})],
      description: 'Shown on the project detail page beneath the gallery.',
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer Credit',
      type: 'string',
      group: 'content',
      description: 'Name of the photographer, e.g. "Studio Hahn", "Jeff Hahn".',
    }),

    // ── Gallery group ──────────────────────────────────────
    defineField({
      name: 'featuredImages',
      title: 'Homepage Featured Images',
      type: 'featuredImages',
      group: 'gallery',
      description:
        'The image composition shown on the homepage. 1–3 images with freeform canvas positioning. Set the primary image to determine where the project title anchors.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Slides',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({type: 'gallerySlide'})],
      description:
        'The project gallery. Each slide is a canvas with 1–3 freely positioned images. Add as many slides as needed.',
    }),

    // ── Meta group ─────────────────────────────────────────
    defineField({
      name: 'press',
      title: 'Press',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({type: 'pressItem'})],
      description: 'Publications that have featured this project. Displayed on the project page.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      description: 'Controls homepage ordering. Lower numbers appear first.',
      initialValue: 0,
      validation: (rule) => rule.integer(),
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'featuredImages.images.0.image',
      photographer: 'photographer',
      order: 'order',
    },
    prepare({title, media, photographer, order}) {
      const orderPrefix = order !== undefined && order !== null ? `${order}. ` : ''
      return {
        title: `${orderPrefix}${title ?? 'Untitled'}`,
        subtitle: photographer ? `Photo: ${photographer}` : undefined,
        media,
      }
    },
  },
})
