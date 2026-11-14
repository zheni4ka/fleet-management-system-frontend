import Link from "next/link"
import { SearchX } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"
import { appRoutes, homeLinkLabel } from "@/lib/constants"

export default function NotFoundPage() {
  return (
    <StatusMessagePage
      icon={SearchX}
      title="Сторінку не знайдено"
      description="Можливо, адресу введено з помилкою або сторінку було переміщено."
    >
      <Button asChild className="cursor-pointer">
        <Link href={appRoutes.home}>{homeLinkLabel}</Link>
      </Button>
    </StatusMessagePage>
  )
}
