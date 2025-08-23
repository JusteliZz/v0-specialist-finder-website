"use client"

import { useEffect, useRef } from "react"

export function useErrorScroll(error: string | null) {
  const errorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [error])

  return errorRef
}
