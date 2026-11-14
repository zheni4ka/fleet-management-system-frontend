import { LoginForm } from "@/components/login-form"
import { loginSearchParamNames } from "@/lib/constants"
import { getSafeReturnPath } from "@/lib/login-redirect"
import { getPageSearchParamValue } from "@/lib/search-params"
import { LoginRedirectReason, PageSearchParams } from "@/lib/types"

interface LoginPageProps {
  searchParams: Promise<PageSearchParams>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const pageSearchParams = await searchParams

  return (
    <LoginForm
      returnPath={getSafeReturnPath(
        getPageSearchParamValue(
          pageSearchParams,
          loginSearchParamNames.returnUrl
        )
      )}
      isSessionExpired={
        getPageSearchParamValue(
          pageSearchParams,
          loginSearchParamNames.reason
        ) === LoginRedirectReason.SessionExpired
      }
    />
  )
}
