"use client"

import { useEffect, useId, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { ChangeTemporaryPasswordForm } from "@/components/change-temporary-password-form"
import { getApiErrorMessage, getApiProblemType } from "@/lib/api-error-message"
import {
  apiProblemTypes,
  bffRoutes,
  commonUiTexts,
  httpContentTypes,
  httpHeaderNames,
  httpStatusCodes,
} from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import {
  HttpMethod,
  LoginRedirectReason,
  TemporaryPasswordLogin,
} from "@/lib/types"

const invalidCredentialsErrorMessage =
  "Неправильне ім'я користувача або пароль."

interface LoginFormProps {
  returnPath: string
  isSessionExpired: boolean
}

async function isPasswordChangeRequiredResponse(
  response: Response
): Promise<boolean> {
  return (
    response.status === httpStatusCodes.forbidden &&
    (await getApiProblemType(response.clone())) ===
      apiProblemTypes.passwordChangeRequired
  )
}

export function LoginForm({ returnPath, isSessionExpired }: LoginFormProps) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null
  )
  const [isLoginRequestRunning, setIsLoginRequestRunning] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [temporaryPasswordLogin, setTemporaryPasswordLogin] =
    useState<TemporaryPasswordLogin | null>(null)
  const passwordInputId = useId()

  useEffect(() => {
    if (!isSessionExpired) {
      return
    }
    const clearExpiredSession = async () => {
      try {
        await fetch(bffRoutes.sessionLogout, { method: HttpMethod.Post })
      } catch (error) {
        console.error("Не вдалося очистити завершену сесію:", error)
      }
      toast.error(commonUiTexts.sessionExpiredMessage, {
        id: LoginRedirectReason.SessionExpired,
      })
      router.replace(createLoginPath(returnPath, null))
      router.refresh()
    }
    void clearExpiredSession()
  }, [isSessionExpired, returnPath, router])

  const openReturnPath = () => {
    router.push(returnPath)
    router.refresh()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginErrorMessage(null)
    setIsLoginRequestRunning(true)

    try {
      const trimmedUsername = username.trim()
      const response = await fetch(bffRoutes.sessionLogin, {
        method: HttpMethod.Post,
        headers: { [httpHeaderNames.contentType]: httpContentTypes.json },
        body: JSON.stringify({ username: trimmedUsername, password }),
      })

      if (response.ok) {
        openReturnPath()
        return
      }
      if (await isPasswordChangeRequiredResponse(response)) {
        setTemporaryPasswordLogin({
          username: trimmedUsername,
          temporaryPassword: password,
        })
        setPassword("")
        return
      }
      setLoginErrorMessage(
        await getApiErrorMessage(response, invalidCredentialsErrorMessage)
      )
    } catch (error) {
      console.error("Помилка при вході:", error)
      setLoginErrorMessage(commonUiTexts.serverUnavailableMessage)
    } finally {
      setIsLoginRequestRunning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            {temporaryPasswordLogin === null
              ? "Вхід у систему"
              : "Зміна тимчасового пароля"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">Fleet Management System</p>
        </div>

        {temporaryPasswordLogin !== null ? (
          <ChangeTemporaryPasswordForm
            temporaryPasswordLogin={temporaryPasswordLogin}
            onPasswordChanged={openReturnPath}
            onCancel={() => setTemporaryPasswordLogin(null)}
          />
        ) : (
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
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Введіть ім'я користувача або email"
                />
              </FormField>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={passwordInputId}
                  className="text-sm font-medium text-slate-700"
                >
                  Пароль
                </label>
                <div className="relative">
                  <Input
                    id={passwordInputId}
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={
                      isPasswordVisible ? "Сховати пароль" : "Показати пароль"
                    }
                    aria-pressed={isPasswordVisible}
                    aria-controls={passwordInputId}
                    onClick={() =>
                      setIsPasswordVisible(
                        (isPasswordVisibleBefore) => !isPasswordVisibleBefore
                      )
                    }
                    className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center rounded-r-lg text-slate-500 hover:text-slate-800"
                  >
                    {isPasswordVisible ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoginRequestRunning}
              variant="accent"
              className="w-full motion-safe:active:scale-95"
            >
              {isLoginRequestRunning ? "Вхід..." : "Увійти"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
