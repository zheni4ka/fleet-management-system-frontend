"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import toast from "react-hot-toast"
import { resolveAppLocale } from "@/lib/app-locale"
import { bffRoutes, httpContentTypes, httpHeaderNames } from "@/lib/constants"
import { AppLocale, HttpMethod } from "@/lib/types"
import { cn } from "@/lib/utils"

export function LanguageSwitch() {
  const router = useRouter()
  const languageTranslations = useTranslations("language")
  const currentAppLocale = resolveAppLocale(useLocale())
  const [isLanguageChangeRunning, setIsLanguageChangeRunning] = useState(false)

  const changeLanguage = async (selectedAppLocale: AppLocale) => {
    if (selectedAppLocale === currentAppLocale) {
      return
    }
    setIsLanguageChangeRunning(true)
    try {
      const languageChangeResponse = await fetch(bffRoutes.sessionLanguage, {
        method: HttpMethod.Post,
        headers: { [httpHeaderNames.contentType]: httpContentTypes.json },
        body: JSON.stringify({ language: selectedAppLocale }),
      })
      if (!languageChangeResponse.ok) {
        toast.error(languageTranslations("changeFailed"))
        return
      }
      router.refresh()
    } catch (error) {
      console.error(languageTranslations("changeFailed"), error)
      toast.error(languageTranslations("changeFailed"))
    } finally {
      setIsLanguageChangeRunning(false)
    }
  }

  return (
    <div
      role="group"
      aria-label={languageTranslations("switchLabel")}
      className="flex items-center rounded-xl bg-slate-800 p-0.5"
    >
      {Object.values(AppLocale).map((appLocale) => (
        <button
          key={appLocale}
          type="button"
          aria-pressed={appLocale === currentAppLocale}
          disabled={isLanguageChangeRunning}
          onClick={() => void changeLanguage(appLocale)}
          className={cn(
            "cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
            appLocale === currentAppLocale && "bg-slate-600 text-white"
          )}
        >
          {languageTranslations(appLocale)}
        </button>
      ))}
    </div>
  )
}
