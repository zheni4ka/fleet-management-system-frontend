import { floatingPanelVisibleEdgePixels } from "@/lib/constants"
import { FloatingPanelPosition, FloatingPanelState } from "@/lib/types"

export function clampFloatingPanelPositionToViewport(
  floatingPanelPosition: FloatingPanelPosition
): FloatingPanelPosition {
  return {
    left: Math.min(
      Math.max(0, floatingPanelPosition.left),
      window.innerWidth - floatingPanelVisibleEdgePixels
    ),
    top: Math.min(
      Math.max(0, floatingPanelPosition.top),
      window.innerHeight - floatingPanelVisibleEdgePixels
    ),
  }
}

export const defaultFloatingPanelState: FloatingPanelState = Object.freeze({
  isCollapsed: false,
  position: null,
})

function isFiniteNumber(candidateValue: unknown): candidateValue is number {
  return typeof candidateValue === "number" && Number.isFinite(candidateValue)
}

function parseFloatingPanelPosition(
  candidatePosition: unknown
): FloatingPanelPosition | null {
  if (typeof candidatePosition !== "object" || candidatePosition === null) {
    return null
  }
  const { left, top } = candidatePosition as Record<string, unknown>
  return isFiniteNumber(left) && isFiniteNumber(top) ? { left, top } : null
}

export function parseFloatingPanelState(
  serializedFloatingPanelState: string | null
): FloatingPanelState {
  if (serializedFloatingPanelState === null) {
    return defaultFloatingPanelState
  }
  try {
    const candidateFloatingPanelState: unknown = JSON.parse(
      serializedFloatingPanelState
    )
    if (
      typeof candidateFloatingPanelState !== "object" ||
      candidateFloatingPanelState === null
    ) {
      return defaultFloatingPanelState
    }
    const { isCollapsed, position } = candidateFloatingPanelState as Record<
      string,
      unknown
    >
    return {
      isCollapsed: isCollapsed === true,
      position: parseFloatingPanelPosition(position),
    }
  } catch {
    return defaultFloatingPanelState
  }
}

export function serializeFloatingPanelState(
  floatingPanelState: FloatingPanelState
): string {
  return JSON.stringify(floatingPanelState)
}
