import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * studioInfoType
 *
 * Singleton document for the Studio panel content.
 * Contains the about blurb, studio image, the flexible
 * info sections (Contact, Team, Clients, Collaborators),
 * and footer details (locations, email, Instagram).
 */
export const studioInfoType = defineType({
  name: 'studioInfo',
  title: 'Studio Info',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The main heading on the studio page.',
      initialValue: 'WE ARE NICE PROJECTS',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Studio Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Rich text blurb about the studio. Supports basic formatting.',
    }),
    defineField({
      name: 'studioImage',
      title: 'Studio Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Primary image displayed on the studio page.',
    }),
    defineField({
      name: 'studioImageCaption',
      title: 'Studio Image Caption',
      type: 'string',
      description: 'Credit or caption for the studio image, e.g. "Photography by David Thompson".',
    }),
    defineField({
      name: 'sections',
      title: 'Info Sections',
      type: 'array',
      of: [defineArrayMember({type: 'infoSection'})],
      description:
        'Ordered list of information sections. Drag to reorder. Each section has a title and a list of items.',
    }),
    defineField({
      name: 'footerLocations',
      title: 'Footer Locations',
      type: 'string',
      description: 'Location line displayed in the footer, e.g. "London & Sydney".',
      initialValue: 'London & Sydney',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Primary contact email displayed in the footer.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Link to the studio Instagram profile.',
      validation: (rule) =>
        rule.uri({allowRelative: false, scheme: ['https']}),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Studio Info'}
    },
  },
})