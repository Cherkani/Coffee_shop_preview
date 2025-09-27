"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface OrderTimerProps {
  createdAt: Date
  className?: string
}

export function OrderTimer({ createdAt, className }: OrderTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date().getTime()
      const created = new Date(createdAt).getTime()
      const diffMs = now - created
      const diffMins = Math.floor(diffMs / 60000)
      setElapsed(diffMins)
    }

    updateElapsed()
    const timer = setInterval(updateElapsed, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [createdAt])

  const getTimerColor = () => {
    if (elapsed < 5) return "text-green-600"
    if (elapsed < 10) return "text-yellow-600"
    if (elapsed < 15) return "text-orange-600"
    return "text-red-600"
  }

  const formatTime = () => {
    if (elapsed < 60) {
      return `${elapsed}m`
    }
    const hours = Math.floor(elapsed / 60)
    const minutes = elapsed % 60
    return `${hours}h ${minutes}m`
  }

  return <span className={cn("font-mono font-semibold", getTimerColor(), className)}>{formatTime()}</span>
}
