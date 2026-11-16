import { LoginForm } from "@/components/login-form"
import { loginSearchParamNames } from "@/lib/constants"
import { getSafeReturnPath } from "@/lib/login-redirect"
import { getPageSearchParamValue } from "@/lib/search-params"
import { getSingleSignOnSettings } from "@/lib/server/single-sign-on-settings"
import { LoginRedirectReason, PageSearchParams } from "@/lib/types"
import { findEnumValue } from "@/lib/utils"

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
      loginRedirectReason={findEnumValue(
        LoginRedirectReason,
        getPageSearchParamValue(pageSearchParams, loginSearchParamNames.reason)
      )}
      isSingleSignOnConfigured={getSingleSignOnSettings() !== null}
    />
  )
}
