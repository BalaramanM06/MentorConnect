"use client"

import { useEffect, useRef, useState } from "react"
import { X, Send } from "lucide-react"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"

interface ChatDialogProps {
  userEmail: string
  peerEmail: string
  peerName?: string
  peerAvatar?: string
  onClose: () => void
}

interface Message {
  sender: string
  content: string
  timestamp: string
}

export default function ChatDialog({
  userEmail,
  peerEmail,
  peerName,
  peerAvatar,
  onClose,
}: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // connect to backend WebSocket
    const ws = new WebSocket(`ws://localhost:8080/chat/${userEmail}`)
    wsRef.current = ws

    ws.onopen = () => console.log("✅ WebSocket connected")

    ws.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data)
      setMessages((prev) => [...prev, msg])
    }

    ws.onclose = () => console.log("❌ WebSocket closed")
    ws.onerror = (err) => console.error("WebSocket error:", err)

    return () => ws.close()
  }, [userEmail])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return
    const msg: Message = {
      sender: userEmail,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    wsRef.current.send(JSON.stringify({ ...msg, recipient: peerEmail }))
    setMessages((prev) => [...prev, msg])
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-end justify-end p-4 z-50 bg-black/30"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="w-full max-w-sm h-[90%] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src={peerAvatar || "/placeholder.svg"}
                alt={peerName || peerEmail}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <div>
                <p className="text-gray-900 font-semibold leading-tight">
                  {peerName || peerEmail}
                </p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, idx) => {
              const isMine = msg.sender === userEmail
              return (
                <div
                  key={idx}
                  className={clsx(
                    "flex items-end",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  {!isMine && (
                    <img
                      src={peerAvatar || "/placeholder.svg"}
                      className="w-8 h-8 rounded-full mr-2 border border-gray-300"
                      alt="avatar"
                    />
                  )}
                  <div
                    className={clsx(
                      "max-w-[70%] px-3 py-2 rounded-2xl shadow-sm",
                      isMine
                        ? "bg-gray-900 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                    )}
                  >
                    <p className="text-sm leading-snug">{msg.content}</p>
                    <p className="text-[10px] mt-1 text-gray-400 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={sendMessage}
              className="bg-gray-900 text-white rounded-full p-2.5 hover:bg-gray-700 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
