import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Used in the browser tab and for SEO.',
      initialValue: 'Nice Projects',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Primary logo displayed in the header. SVG recommended for sharpness.',
    }),
    defineField({
      name: 'logoMobile',
      title: 'Logo (Mobile)',
      type: 'image',
      description: 'Alternative logo displayed on mobile devices. If not set, the primary logo is used.',
    }),
    defineField({
      name: 'landingImages',
      title: 'Landing Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      description:
        'Pool of images for the landing splash screen. One is chosen at random on each visit.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})