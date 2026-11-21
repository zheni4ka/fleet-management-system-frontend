import "./globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"
import { AppToaster } from "@/components/app-toaster"
import { Header } from "@/components/header"
import {
  getKnownUserRolesFromAuthToken,
  getUserNameFromAuthToken,
  hasAuthTokenUserRole,
  isAuthTokenUnexpired,
} from "@/lib/auth-token"
import { getAuthTokenFromCookies } from "@/lib/server/api"
import { UserRole } from "@/lib/types"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Fleet Management System",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  description:
    "Fleet Management System for managing vehicle fleets, drivers, and routes. Built with Next.js and TypeScript.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const appLocale = await getLocale()
  const authToken = await getAuthTokenFromCookies()
  const unexpiredAuthToken =
    authToken !== null && isAuthTokenUnexpired(authToken) ? authToken : null

  return (
    <html className={`${inter.className} p-3 sm:p-6`} lang={appLocale}>
      <body className="antialiased">
        <NextIntlClientProvider>
          {unexpiredAuthToken !== null && (
            <Header
              className="fixed inset-x-0 top-0 z-45 w-full"
              isAdmin={hasAuthTokenUserRole(unexpiredAuthToken, UserRole.Admin)}
              currentUserName={getUserNameFromAuthToken(unexpiredAuthToken)}
              currentUserRoles={getKnownUserRolesFromAuthToken(
                unexpiredAuthToken
              )}
            />
          )}
          <main className={unexpiredAuthToken === null ? undefined : "pt-8"}>
            {children}
          </main>
          <AppToaster modalWindowId={null} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
