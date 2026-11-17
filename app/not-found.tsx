import Link from "next/link"
import { SearchX } from "lucide-react"
import { StatusMessagePage } from "@/components/status-message-page"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { appRoutes } from "@/lib/constants"

export default function NotFoundPage() {
  const commonTranslations = useTranslations("common")
  return (
    <StatusMessagePage
      icon={SearchX}
      title={commonTranslations("notFoundPageTitle")}
      description={commonTranslations("notFoundPageDescription")}
    >
      <Button asChild>
        <Link href={appRoutes.home}>{commonTranslations("homeLinkLabel")}</Link>
      </Button>
    </StatusMessagePage>
  )
}
