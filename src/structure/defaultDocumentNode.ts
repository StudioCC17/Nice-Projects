import type {DefaultDocumentNodeResolver} from 'sanity/structure'

/**
 * Default document node resolver.
 *
 * Extend this to add panes (e.g. preview, references) to
 * specific document types. Currently uses the default form view.
 */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([S.view.form()])
}
