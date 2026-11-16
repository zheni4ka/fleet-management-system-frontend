import Link from "next/link"
import { SearchX } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"
import { appRoutes, commonUiTexts } from "@/lib/constants"

export default function NotFoundPage() {
  return (
    <StatusMessagePage
      icon={SearchX}
      title="Сторінку не знайдено"
      description="Можливо, адресу введено з помилкою або сторінку було переміщено."
    >
      <Button asChild>
        <Link href={appRoutes.home}>{commonUiTexts.homeLinkLabel}</Link>
      </Button>
    </StatusMessagePage>
  )
}
