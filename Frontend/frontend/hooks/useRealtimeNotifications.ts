"use client"

import { useState, useCallback } from "react"
import { useWebSocket } from "./useWebSocket"
import type { Notification } from "@/types"

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const handleMessage = useCallback((message: { type: string; data: unknown }) => {
    if (message.type === "notification") {
      const notification = message.data as Notification
      setNotifications((prev) => [notification, ...prev])
    }
  }, [])

  const { send, isConnected } = useWebSocket(handleMessage)

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    notifications,
    addNotification,
    clearNotification,
    isConnected,
    send,
  }
}
