"use client"

import { useEffect } from "react"
import Link from "next/link"
import { TriangleAlert } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"
import {
  appRoutes,
  errorPageTitle,
  homeLinkLabel,
  retryButtonLabel,
} from "@/lib/constants"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Помилка під час відображення сторінки:", error)
  }, [error])

  return (
    <StatusMessagePage
      icon={TriangleAlert}
      title={errorPageTitle}
      description="Не вдалося відобразити сторінку. Спробуйте ще раз або поверніться на головну."
    >
      <Button type="button" className="cursor-pointer" onClick={reset}>
        {retryButtonLabel}
      </Button>
      <Button asChild variant="outline" className="cursor-pointer">
        <Link href={appRoutes.home}>{homeLinkLabel}</Link>
      </Button>
    </StatusMessagePage>
  )
}
