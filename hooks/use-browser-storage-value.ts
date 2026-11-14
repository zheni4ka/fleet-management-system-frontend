"use client"

import { useSyncExternalStore } from "react"
import {
  readBrowserStorageValue,
  subscribeToBrowserStorageChanges,
  writeBrowserStorageValue,
} from "@/lib/browser-storage"

function getServerBrowserStorageValue(): string | null {
  return null
}

export function useBrowserStorageValue(storageKey: string) {
  const browserStorageValue = useSyncExternalStore(
    subscribeToBrowserStorageChanges,
    () => readBrowserStorageValue(storageKey),
    getServerBrowserStorageValue
  )

  const setBrowserStorageValue = (storageValue: string) => {
    writeBrowserStorageValue(storageKey, storageValue)
  }

  return { browserStorageValue, setBrowserStorageValue }
}
