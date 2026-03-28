import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * pressItemType
 *
 * A single press credit for a project.
 * Publication name with an optional link to the article.
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
  ],
  preview: {
    select: {title: 'publication', url: 'url'},
    prepare({title, url}) {
      return {
        title: title ?? 'Untitled',
        subtitle: url ? 'Linked' : 'No link',
      }
    },
  },
})
