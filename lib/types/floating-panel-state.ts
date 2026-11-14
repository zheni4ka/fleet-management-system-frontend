import { FloatingPanelPosition } from "./floating-panel-position"

export interface FloatingPanelState {
  isCollapsed: boolean
  position: FloatingPanelPosition | null
}
