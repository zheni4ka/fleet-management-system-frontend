"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { appRoutes } from "@/lib/constants"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const commonTranslations = useTranslations("common")
  useEffect(() => {
    console.error("Page rendering failed:", error)
  }, [error])

  return (
    <StatusMessagePage
      icon={TriangleAlert}
      title={commonTranslations("errorPageTitle")}
      description={commonTranslations("pageRenderErrorDescription")}
    >
      <Button type="button" onClick={reset}>
        {commonTranslations("retryButtonLabel")}
      </Button>
      <Button asChild variant="outline">
        <Link href={appRoutes.home}>{commonTranslations("homeLinkLabel")}</Link>
      </Button>
    </StatusMessagePage>
  )
}
