import {CaseIcon, CogIcon, HomeIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export const SINGLETON_TYPES = new Set(['siteSettings', 'studioInfo'])

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.listItem()
        .title('Studio Info')
        .icon(HomeIcon)
        .child(S.document().schemaType('studioInfo').documentId('studioInfo')),

      S.divider(),

      // Drag-to-reorder project list
      orderableDocumentListDeskItem({
        type: 'project',
        title: 'Projects',
        icon: CaseIcon,
        S,
        context,
      }),
    ])