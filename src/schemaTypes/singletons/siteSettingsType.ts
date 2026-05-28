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

    // ── Landing splash images ──
    defineField({
      name: 'landingMode',
      title: 'Landing Image Mode',
      type: 'string',
      description:
        'Choose which pool of images the landing splash picks from. "Random" picks from a wide mix; "Curated" picks from a hand-selected set (often a single project).',
      options: {
        list: [
          {title: 'Random pool', value: 'random'},
          {title: 'Curated pool', value: 'curated'},
        ],
        layout: 'radio',
      },
      initialValue: 'random',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'landingImages',
      title: 'Random Pool',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      description:
        'Wide pool of images. One is chosen at random on each visit when "Random pool" is selected above.',
    }),
    defineField({
      name: 'curatedPoolImages',
      title: 'Curated Pool',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      description:
        'Hand-picked images, typically from a single project. One is chosen at random on each visit when "Curated pool" is selected above.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})