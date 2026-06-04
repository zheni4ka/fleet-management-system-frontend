import "./globals.css"
import Header from '@/components/header'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Fleet Management System",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  description: "Fleet Management System for managing vehicle fleets, drivers, and routes. Built with Next.js and TypeScript.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${inter.className} p-6`} lang="uk">
      <body className="antialiased">
        <Header className='fixed top-0 w-full inset-x-0 z-1000'/>
        <main>{children}</main>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  )
}