import './globals.css'
import type { Metadata } from 'next'
import { Barlow_Condensed, Share_Tech_Mono } from 'next/font/google'
const barlow=Barlow_Condensed({subsets:['latin'],weight:['400','500','600','700','800'],variable:'--font-barlow'})
const mono=Share_Tech_Mono({subsets:['latin'],weight:'400',variable:'--font-mono'})
export const :
export  RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${barlow.variable} ${mono.variable} font-barlow min-h-screen bg-bg`}>{children}</body></html>}
