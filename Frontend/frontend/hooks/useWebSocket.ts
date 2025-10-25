"use client"

import { useEffect, useRef, useCallback } from "react"
import { SOCKET_URL } from "@/config/appConfig"

interface WebSocketMessage {
  type: string
  data: unknown
}

export const useWebSocket = (onMessage: (message: WebSocketMessage) => void) => {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      wsRef.current = new WebSocket(SOCKET_URL)

      wsRef.current.onopen = () => {
        console.log("[WebSocket] Connected")
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          onMessage(message)
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error)
        }
      }

      wsRef.current.onerror = (error) => {
        console.error("[WebSocket] Error:", error)
      }

      wsRef.current.onclose = () => {
        console.log("[WebSocket] Disconnected")
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000)
      }
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error)
    }
  }, [onMessage])

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { send, isConnected: wsRef.current?.readyState === WebSocket.OPEN }
}
