let openModalWindowIds: ReadonlyArray<string> = []
const openModalWindowStackListeners = new Set<() => void>()

function notifyOpenModalWindowStackListeners(): void {
  for (const openModalWindowStackListener of openModalWindowStackListeners) {
    openModalWindowStackListener()
  }
}

export function pushOpenModalWindowId(modalWindowId: string): void {
  openModalWindowIds = [...openModalWindowIds, modalWindowId]
  notifyOpenModalWindowStackListeners()
}

export function removeOpenModalWindowId(modalWindowId: string): void {
  openModalWindowIds = openModalWindowIds.filter(
    (openModalWindowId) => openModalWindowId !== modalWindowId
  )
  notifyOpenModalWindowStackListeners()
}

export function getTopOpenModalWindowId(): string | null {
  return openModalWindowIds.at(-1) ?? null
}

export function subscribeToOpenModalWindowStack(
  openModalWindowStackListener: () => void
): () => void {
  openModalWindowStackListeners.add(openModalWindowStackListener)
  return () => {
    openModalWindowStackListeners.delete(openModalWindowStackListener)
  }
}
