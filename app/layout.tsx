import "./globals.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import { Toaster } from "react-hot-toast"
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
  const authToken = await getAuthTokenFromCookies()
  const unexpiredAuthToken =
    authToken !== null && isAuthTokenUnexpired(authToken) ? authToken : null

  return (
    <html className={`${inter.className} p-3 sm:p-6`} lang="uk">
      <body className="antialiased">
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
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  )
}
