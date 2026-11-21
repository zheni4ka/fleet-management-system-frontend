"use client"

import { Toaster } from "react-hot-toast"
import { useTopOpenModalWindowId } from "@/hooks/use-top-open-modal-window-id"
import { appToasterPositions } from "@/lib/constants"

interface AppToasterProps {
  modalWindowId: string | null
}

export function AppToaster({ modalWindowId }: AppToasterProps) {
  const topOpenModalWindowId = useTopOpenModalWindowId()
  if (topOpenModalWindowId !== modalWindowId) {
    return null
  }
  return (
    <Toaster
      position={
        modalWindowId === null
          ? appToasterPositions.page
          : appToasterPositions.modalWindow
      }
      reverseOrder={false}
    />
  )
}
