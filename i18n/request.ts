import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"
import { resolveAppLocale } from "@/lib/app-locale"
import { cookieNames } from "@/lib/constants"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const appLocale = resolveAppLocale(cookieStore.get(cookieNames.locale)?.value)
  return {
    locale: appLocale,
    messages: (await import(`../messages/${appLocale}.json`)).default,
  }
})
