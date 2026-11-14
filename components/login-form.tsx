"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { getClientApiBaseUrl } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error-message"
import { deleteBrowserCookie, setBrowserCookie } from "@/lib/browser-cookies"
import {
  apiEndpoints,
  authCookieMaxAgeSeconds,
  cookieNames,
  sessionExpiredMessage,
} from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import { HttpMethod, LoginRedirectReason, LoginResponse } from "@/lib/types"

const invalidCredentialsErrorMessage =
  "Неправильне ім'я користувача або пароль."

interface LoginFormProps {
  returnPath: string
  isSessionExpired: boolean
}

export function LoginForm({ returnPath, isSessionExpired }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null
  )
  const [isLoginRequestRunning, setIsLoginRequestRunning] = useState(false)

  useEffect(() => {
    if (!isSessionExpired) {
      return
    }
    deleteBrowserCookie(cookieNames.authToken)
    toast.error(sessionExpiredMessage, {
      id: LoginRedirectReason.SessionExpired,
    })
    router.replace(createLoginPath(returnPath, null))
    router.refresh()
  }, [isSessionExpired, returnPath, router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginErrorMessage(null)
    setIsLoginRequestRunning(true)

    try {
      const response = await fetch(
        `${getClientApiBaseUrl()}${apiEndpoints.login}`,
        {
          method: HttpMethod.Post,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password }),
        }
      )

      if (response.status === 401) {
        setLoginErrorMessage(invalidCredentialsErrorMessage)
        return
      }
      if (!response.ok) {
        setLoginErrorMessage(
          await getApiErrorMessage(response, invalidCredentialsErrorMessage)
        )
        return
      }

      const loginResponse: LoginResponse = await response.json()
      setBrowserCookie(
        cookieNames.authToken,
        loginResponse.token,
        authCookieMaxAgeSeconds
      )
      router.push(returnPath)
      router.refresh()
    } catch (error) {
      console.error("Помилка при вході:", error)
      setLoginErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Сталася помилка при вході."
      )
    } finally {
      setIsLoginRequestRunning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Вхід у систему
          </h1>
          <p className="mt-2 text-sm text-slate-600">Fleet Management System</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {loginErrorMessage !== null && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              ⚠️ {loginErrorMessage}
            </div>
          )}
          <div className="space-y-4">
            <FormField label="Ім'я користувача або Email">
              <Input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin або admin@gmail.com"
              />
            </FormField>
            <FormField label="Пароль">
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </FormField>
          </div>

          <Button
            type="submit"
            disabled={isLoginRequestRunning}
            className="w-full bg-blue-600 text-white transition-transform duration-200 hover:bg-blue-700 active:scale-95"
          >
            {isLoginRequestRunning ? "Вхід..." : "Увійти"}
          </Button>
        </form>
      </div>
    </div>
  )
}
