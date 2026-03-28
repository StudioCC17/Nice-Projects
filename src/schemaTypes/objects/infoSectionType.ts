import {BlockContentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * infoSectionType
 *
 * A titled section used on the Studio page.
 * Each section has a heading and a rich text body,
 * giving the editor full control over content and links.
 */
export const infoSectionType = defineType({
  name: 'infoSection',
  title: 'Info Section',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'The heading for this section, e.g. "Contact", "Team", "Clients".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Rich text content for this section. Supports formatting and links.',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title ?? 'Untitled section',
      }
    },
  },
})