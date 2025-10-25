"use client"

import { useState, useEffect } from "react"
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react"
import type { Notification } from "@/types"
import { getNotifications } from "@/utils/api"
import { useAuth } from "@/context/AuthContext"


export default function NotificationCenter() {
    const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "enrollment":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "session":
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case "certificate":
        return <CheckCircle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const dismissNotification = async (id: string, email: string) => {
  try {
    const res = await fetch(`/api/delete-notification/email?email=${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }), 
    });

    if (!res.ok) {
      throw new Error("Failed to delete notification from server");
    }

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  } catch (error) {
    console.error("Error deleting notification:", error);
    alert("Failed to delete notification. Please try again.");
  }
};


  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 hover:bg-muted rounded-lg transition-colors">
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-border shadow-lg z-50">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-muted transition-colors ${!notif.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notif.id , user?.email || "")}
                        className="flex-shrink-0 p-1 hover:bg-white rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
