import {BlockContentIcon, DocumentPdfIcon, LinkIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * infoSectionType
 *
 * A titled section used on the Studio page.
 * Each section has a heading and a rich text body,
 * giving the editor full control over content and links.
 *
 * The rich text supports two annotation types:
 *  - link:     a standard external URL (preserved from Sanity's defaults)
 *  - fileLink: an uploaded file (PDF), for press links and downloads
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
      description: 'The heading for this section, e.g. "Contact", "Team", "Clients", "Press".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          // Customising `marks.annotations` overrides Sanity's defaults, so the
          // standard URL link is re-declared here to keep it available.
          marks: {
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                icon: LinkIcon,
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule
                        .uri({scheme: ['http', 'https', 'mailto', 'tel']})
                        .required(),
                  }),
                ],
              }),
              defineArrayMember({
                name: 'fileLink',
                title: 'PDF / File',
                type: 'object',
                icon: DocumentPdfIcon,
                fields: [
                  defineField({
                    name: 'file',
                    title: 'File',
                    type: 'file',
                    options: {accept: 'application/pdf'},
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      description:
        'Rich text content for this section. To add a press link, select some text and use the PDF / File annotation to attach an uploaded document.',
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