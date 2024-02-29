import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'
import copy from './copy'
import heroImg from '../public/PIA12936.jpg'

export const metadata: Metadata = {
  title: {
    default: `${copy.title0} ${copy.title1}`,
    template: '%s | Arch Lunar Art Archive',
  },
  description: copy.description,
  openGraph: {
    title: `${copy.title0} ${copy.title1}`,
    description: copy.description,
    siteName: 'Arch Lunar Art Archive',
    images: [
      {
        url: heroImg.src,
        alt: 'unnamed crater lying near the center of the 42-km diameter crater Henry Frères (23.5°S, 58.9°W)',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>{children}</body>
      <GoogleTagManager gtmId="GTM-PK2ML5FB" />
    </html>
  )
}