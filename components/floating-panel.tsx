"use client"

import { useRef, useState, type PointerEvent, type ReactNode } from "react"
import { ChevronDown, ChevronUp, GripVertical, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBrowserStorageValue } from "@/hooks/use-browser-storage-value"
import { floatingPanelVisibleEdgePixels } from "@/lib/constants"
import {
  clampFloatingPanelPositionToViewport,
  parseFloatingPanelState,
  serializeFloatingPanelState,
} from "@/lib/floating-panel-state"
import { FloatingPanelPosition, FloatingPanelState } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FloatingPanelProps {
  title: string
  badgeText: string | null
  storageKey: string
  children: ReactNode
}

export function FloatingPanel({
  title,
  badgeText,
  storageKey,
  children,
}: FloatingPanelProps) {
  const { browserStorageValue, setBrowserStorageValue } =
    useBrowserStorageValue(storageKey)
  const storedFloatingPanelState = parseFloatingPanelState(browserStorageValue)
  const [draggedPanelPosition, setDraggedPanelPosition] =
    useState<FloatingPanelPosition | null>(null)
  const panelRef = useRef<HTMLElement>(null)
  const dragPointerOffsetRef = useRef<FloatingPanelPosition | null>(null)

  const panelPosition =
    draggedPanelPosition ?? storedFloatingPanelState.position
  const { isCollapsed } = storedFloatingPanelState

  const saveFloatingPanelState = (
    floatingPanelStateChanges: Partial<FloatingPanelState>
  ) => {
    setBrowserStorageValue(
      serializeFloatingPanelState({
        ...storedFloatingPanelState,
        ...floatingPanelStateChanges,
      })
    )
  }

  const handleDragHandlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || panelRef.current === null) {
      return
    }
    const panelRect = panelRef.current.getBoundingClientRect()
    dragPointerOffsetRef.current = {
      left: event.clientX - panelRect.left,
      top: event.clientY - panelRect.top,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleDragHandlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragPointerOffset = dragPointerOffsetRef.current
    if (dragPointerOffset === null) {
      return
    }
    setDraggedPanelPosition(
      clampFloatingPanelPositionToViewport({
        left: event.clientX - dragPointerOffset.left,
        top: event.clientY - dragPointerOffset.top,
      })
    )
  }

  const handleDragHandlePointerRelease = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (dragPointerOffsetRef.current === null) {
      return
    }
    dragPointerOffsetRef.current = null
    event.currentTarget.releasePointerCapture(event.pointerId)
    if (draggedPanelPosition !== null) {
      saveFloatingPanelState({ position: draggedPanelPosition })
      setDraggedPanelPosition(null)
    }
  }

  return (
    <section
      ref={panelRef}
      aria-label={title}
      className={cn(
        "rounded-xl border bg-white shadow-sm",
        panelPosition !== null &&
          "fixed z-40 w-[min(60rem,calc(100vw-2rem))] shadow-xl ring-1 ring-slate-200"
      )}
      style={
        panelPosition === null
          ? undefined
          : {
              left: `min(${panelPosition.left}px, calc(100vw - ${floatingPanelVisibleEdgePixels}px))`,
              top: `min(${panelPosition.top}px, calc(100vh - ${floatingPanelVisibleEdgePixels}px))`,
            }
      }
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <div
          title="Перетягніть, щоб перемістити панель"
          onPointerDown={handleDragHandlePointerDown}
          onPointerMove={handleDragHandlePointerMove}
          onPointerUp={handleDragHandlePointerRelease}
          onPointerCancel={handleDragHandlePointerRelease}
          className="flex min-w-0 flex-1 cursor-grab touch-none items-center gap-2 select-none active:cursor-grabbing"
        >
          <GripVertical
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-slate-500"
          />
          <h2 className="truncate text-sm font-semibold text-slate-700">
            {title}
          </h2>
          {badgeText !== null && (
            <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset">
              {badgeText}
            </span>
          )}
        </div>

        {panelPosition !== null && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => saveFloatingPanelState({ position: null })}
          >
            <Pin />
            Закріпити
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Розгорнути панель" : "Згорнути панель"}
          title={isCollapsed ? "Розгорнути панель" : "Згорнути панель"}
          onClick={() => saveFloatingPanelState({ isCollapsed: !isCollapsed })}
        >
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
        </Button>
      </div>

      <div hidden={isCollapsed} className="border-t px-4 pt-3 pb-4">
        {children}
      </div>
    </section>
  )
}
