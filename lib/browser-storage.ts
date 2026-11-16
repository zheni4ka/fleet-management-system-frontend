import { browserEventNames } from "@/lib/constants"

const browserStorageValuesInMemory = new Map<string, string>()

export function readBrowserStorageValue(storageKey: string): string | null {
  const storageValueInMemory = browserStorageValuesInMemory.get(storageKey)
  if (storageValueInMemory !== undefined) {
    return storageValueInMemory
  }
  try {
    return window.localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

export function writeBrowserStorageValue(
  storageKey: string,
  storageValue: string
): void {
  browserStorageValuesInMemory.set(storageKey, storageValue)
  try {
    window.localStorage.setItem(storageKey, storageValue)
  } catch (error) {
    console.warn(
      `Не вдалося зберегти "${storageKey}" у сховищі браузера:`,
      error
    )
  }
  window.dispatchEvent(new Event(browserEventNames.browserStorageChange))
}

export function subscribeToBrowserStorageChanges(
  onBrowserStorageChange: () => void
): () => void {
  window.addEventListener(
    browserEventNames.browserStorageChange,
    onBrowserStorageChange
  )
  return () => {
    window.removeEventListener(
      browserEventNames.browserStorageChange,
      onBrowserStorageChange
    )
  }
}
