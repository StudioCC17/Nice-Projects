import {CaseIcon, CogIcon, HomeIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

/**
 * Singleton document IDs.
 *
 * Used in the structure builder (to render singletons as
 * single-item views) and in sanity.config.ts (to prevent
 * creating duplicates).
 */
export const SINGLETON_TYPES = new Set(['siteSettings', 'studioInfo'])

/**
 * Structure builder configuration.
 *
 * Singletons are rendered as direct document views (not lists).
 * Projects get a standard filterable list sorted by display order.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Site Settings (singleton) ──
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      // ── Studio Info (singleton) ──
      S.listItem()
        .title('Studio Info')
        .icon(HomeIcon)
        .child(S.document().schemaType('studioInfo').documentId('studioInfo')),

      S.divider(),

      // ── Projects (collection) ──
      S.listItem()
        .title('Projects')
        .icon(CaseIcon)
        .child(
          S.documentTypeList('project')
            .title('Projects')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])
