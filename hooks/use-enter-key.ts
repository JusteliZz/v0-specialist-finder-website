"use client"

import { useEffect } from "react"

export function useEnterKey(callback: () => void, dependencies: any[] = []) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, dependencies)
}
