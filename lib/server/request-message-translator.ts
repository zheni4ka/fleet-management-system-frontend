import { createTranslator } from "next-intl"
import type { NextRequest } from "next/server"
import { resolveAppLocale } from "@/lib/app-locale"
import { cookieNames } from "@/lib/constants"
import { AppLocale } from "@/lib/types"
import englishMessages from "@/messages/en.json"
import ukrainianMessages from "@/messages/uk.json"

const appMessagesByAppLocale: Readonly<
  Record<AppLocale, typeof ukrainianMessages>
> = Object.freeze({
  [AppLocale.Ukrainian]: ukrainianMessages,
  [AppLocale.English]: englishMessages,
})

export function createRequestMessageTranslator(request: NextRequest) {
  const appLocale = resolveAppLocale(
    request.cookies.get(cookieNames.locale)?.value
  )
  return createTranslator({
    locale: appLocale,
    messages: appMessagesByAppLocale[appLocale],
  })
}
