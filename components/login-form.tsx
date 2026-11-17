"use client"

import { useTranslations } from "next-intl"
import { useEffect, useId, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"
import { ChangeTemporaryPasswordForm } from "@/components/change-temporary-password-form"
import { getApiErrorMessage, getApiProblemType } from "@/lib/api-error-message"
import {
  apiProblemTypes,
  bffRoutes,
  httpContentTypes,
  httpHeaderNames,
  httpStatusCodes,
  loginSearchParamNames,
} from "@/lib/constants"
import { createLoginPath } from "@/lib/login-redirect"
import { cn } from "@/lib/utils"
import {
  HttpMethod,
  LoginRedirectReason,
  TemporaryPasswordLogin,
} from "@/lib/types"

interface LoginFormProps {
  returnPath: string
  loginRedirectReason: LoginRedirectReason | null
  isSingleSignOnConfigured: boolean
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

export function LoginForm({
  returnPath,
  loginRedirectReason,
  isSingleSignOnConfigured,
}: LoginFormProps) {
  const loginRedirectReasonTranslations = useTranslations(
    "loginRedirectReasons"
  )
  const loginTranslations = useTranslations("login")
  const commonTranslations = useTranslations("common")
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
    if (loginRedirectReason === null) {
      return
    }
    const clearSessionAndShowLoginRedirectReason = async () => {
      if (loginRedirectReason === LoginRedirectReason.SessionExpired) {
        try {
          await fetch(bffRoutes.sessionLogout, { method: HttpMethod.Post })
        } catch (error) {
          console.error(commonTranslations("sessionExpiredMessage"), error)
        }
      }
      toast.error(loginRedirectReasonTranslations(loginRedirectReason), {
        id: loginRedirectReason,
      })
      router.replace(createLoginPath(returnPath, null))
      router.refresh()
    }
    void clearSessionAndShowLoginRedirectReason()
  }, [
    commonTranslations,
    loginRedirectReason,
    loginRedirectReasonTranslations,
    returnPath,
    router,
  ])

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
        await getApiErrorMessage(
          response,
          loginTranslations("invalidCredentials")
        )
      )
    } catch (error) {
      console.error(commonTranslations("serverUnavailableMessage"), error)
      setLoginErrorMessage(commonTranslations("serverUnavailableMessage"))
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
              ? loginTranslations("title")
              : loginTranslations("passwordChangeTitle")}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {loginTranslations("productName")}
          </p>
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
              <FormField label={loginTranslations("usernameLabel")}>
                <Input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={loginTranslations("usernamePlaceholder")}
                />
              </FormField>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={passwordInputId}
                  className="text-sm font-medium text-slate-700"
                >
                  {loginTranslations("passwordLabel")}
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
                      isPasswordVisible
                        ? loginTranslations("hidePassword")
                        : loginTranslations("showPassword")
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
              {isLoginRequestRunning
                ? loginTranslations("submitting")
                : loginTranslations("submit")}
            </Button>
            {isSingleSignOnConfigured && (
              <a
                href={`${bffRoutes.singleSignOnStart}?${new URLSearchParams({ [loginSearchParamNames.returnUrl]: returnPath })}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                {loginTranslations("singleSignOn")}
              </a>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
