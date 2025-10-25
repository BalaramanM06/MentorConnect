"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface ProfileDropdownProps {
  userName: string
}

export default function ProfileDropdown({ userName }: ProfileDropdownProps) {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
          {userName[0].toUpperCase()}
        </div>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-foreground">{userName}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  )
}
