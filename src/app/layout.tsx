import type {Metadata} from 'next'

import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Nice Projects',
  description:
    'Nice Projects create welcoming, enjoyable, inspiring homes, workplaces, retail and hospitality spaces.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/nicedisplayneue.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/merivaregular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{
          __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; } window.scrollTo(0, 0);`
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}