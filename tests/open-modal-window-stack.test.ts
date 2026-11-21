import { describe, expect, it } from "vitest"
import {
  getTopOpenModalWindowId,
  pushOpenModalWindowId,
  removeOpenModalWindowId,
  subscribeToOpenModalWindowStack,
} from "@/lib/open-modal-window-stack"

describe("open modal window stack", () => {
  it("tracks the most recently opened modal window as the top one", () => {
    pushOpenModalWindowId("outer-modal-window")
    pushOpenModalWindowId("inner-modal-window")
    expect(getTopOpenModalWindowId()).toBe("inner-modal-window")

    removeOpenModalWindowId("inner-modal-window")
    expect(getTopOpenModalWindowId()).toBe("outer-modal-window")

    removeOpenModalWindowId("outer-modal-window")
    expect(getTopOpenModalWindowId()).toBe(null)
  })

  it("notifies subscribers until they unsubscribe", () => {
    let notificationsCount = 0
    const unsubscribe = subscribeToOpenModalWindowStack(() => {
      notificationsCount += 1
    })

    pushOpenModalWindowId("modal-window")
    unsubscribe()
    removeOpenModalWindowId("modal-window")

    expect(notificationsCount).toBe(1)
  })
})
