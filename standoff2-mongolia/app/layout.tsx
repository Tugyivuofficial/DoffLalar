import '../globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Barlow_Condensed, Share_Tech_Mono } from 'next/font/google'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow',
})

const mono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Standoff 2 Mongolia',
  description: '5v5 & 2v2 competitive lobbies',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${mono.variable} font-barlow min-h-screen bg-bg`}>
        {children}
      </body>
    </html>
  )
}
