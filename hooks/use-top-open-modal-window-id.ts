"use client"

import { useSyncExternalStore } from "react"
import {
  getTopOpenModalWindowId,
  subscribeToOpenModalWindowStack,
} from "@/lib/open-modal-window-stack"

function getServerTopOpenModalWindowId(): string | null {
  return null
}

export function useTopOpenModalWindowId(): string | null {
  return useSyncExternalStore(
    subscribeToOpenModalWindowStack,
    getTopOpenModalWindowId,
    getServerTopOpenModalWindowId
  )
}
