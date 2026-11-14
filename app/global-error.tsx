"use client"

import "./globals.css"
import { useEffect } from "react"
import { TriangleAlert } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"

interface GlobalErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("Критична помилка застосунку:", error)
  }, [error])

  return (
    <html lang="uk">
      <body className="antialiased">
        <StatusMessagePage
          icon={TriangleAlert}
          title="Щось пішло не так"
          description="Застосунок зіткнувся з помилкою. Спробуйте оновити сторінку."
        >
          <Button type="button" className="cursor-pointer" onClick={reset}>
            Спробувати ще
          </Button>
        </StatusMessagePage>
      </body>
    </html>
  )
}
