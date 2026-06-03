import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * pressItemType
 *
 * A single press credit for a project.
 * Publication name with an optional link, which can be either
 * an external article URL or an uploaded PDF.
 */
export const pressItemType = defineType({
  name: 'pressItem',
  title: 'Press Credit',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      description: 'Name of the publication, e.g. "Wallpaper*", "Dezeen", "Monocle".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Article URL',
      type: 'url',
      description: 'Link to the specific article. Leave empty if no online version exists.',
      validation: (rule) =>
        rule.uri({allowRelative: false, scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'file',
      title: 'PDF',
      type: 'file',
      options: {accept: 'application/pdf'},
      description:
        'Upload a PDF to link to instead, for press with no online article. If an Article URL is set above, the URL takes precedence.',
    }),
  ],
  preview: {
    select: {title: 'publication', url: 'url', file: 'file'},
    prepare({title, url, file}) {
      return {
        title: title ?? 'Untitled',
        subtitle: url ? 'Linked (URL)' : file ? 'Linked (PDF)' : 'No link',
      }
    },
  },
})