export function getBrowserCookieValue(cookieName: string): string | null {
  const cookiePrefix = `${cookieName}=`
  const matchingCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(cookiePrefix))
  if (matchingCookie === undefined) {
    return null
  }
  return decodeURIComponent(matchingCookie.slice(cookiePrefix.length))
}

export function setBrowserCookie(
  cookieName: string,
  cookieValue: string,
  maxAgeSeconds: number
): void {
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

export function deleteBrowserCookie(cookieName: string): void {
  document.cookie = `${cookieName}=; path=/; max-age=0; SameSite=Lax`
}
