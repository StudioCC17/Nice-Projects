import {defineQuery} from 'next-sanity'

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    featuredImages {
      primaryImage,
      images[] {
        _key,
        image {
          asset-> {
            _id,
            url,
            metadata { dimensions }
          }
        },
        alt,
        x,
        y,
        width,
        zIndex
      }
    }
  }
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    photographer,
    press[] {
      _key,
      publication,
      url
    },
    gallery[] {
      _key,
      images[] {
        _key,
        image {
          asset-> {
            _id,
            url,
            metadata { dimensions }
          }
        },
        alt,
        x,
        y,
        width,
        zIndex
      }
    }
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteTitle,
    logo {
      asset-> { url }
    },
    logoMobile {
      asset-> { url }
    },
    landingImages[] {
      asset-> {
        _id,
        url,
        metadata { dimensions }
      }
    }
  }
`)

export const STUDIO_QUERY = defineQuery(`
  *[_type == "studioInfo"][0] {
    headline,
    description,
    studioImage {
      asset-> {
        _id,
        url,
        metadata { dimensions }
      }
    },
    studioImageCaption,
    sections[] {
      _key,
      title,
      content
    },
    footerLocations,
    email,
    instagramUrl
  }
`)