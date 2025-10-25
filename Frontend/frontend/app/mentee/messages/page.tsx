"use client"

import { useEffect, useState } from "react"
import { getMentors } from "@/utils/api"
import ChatDialog from "../../../components/ChatDialog"
import type { User } from "@/types"
import { MessageSquare, Mail } from "lucide-react"

export default function StudentMentorsPage() {
  const email = localStorage.getItem("userEmail") || ""
  const [mentors, setMentors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState("")
  const [selectedEmail, setSelectedEmail] = useState("")

  useEffect(() => {
    const loadMentors = async () => {
      try {
        const data = await getMentors()
        setMentors(data)
      } catch (error) {
        console.error("Failed to load mentors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-muted-foreground mt-2">
            Connect and communicate with your assigned mentors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Top Accent Banner */}
              <div className="bg-gradient-to-r from-primary to-secondary h-24"></div>

              {/* Mentor Card */}
              <div className="p-6 -mt-12 relative">
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full border-4 border-white mb-4"
                />
                <h3 className="text-lg font-bold text-foreground">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{mentor.email}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  {mentor.bio || "Expert mentor ready to guide you"}
                </p>

                <div className="flex gap-2">
                  {/* Chat Button */}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:scale-103 transition-transform"
                    onClick={() => {
                      setSelectedEmail(mentor.email)
                      setSelectedMentor(mentor.name)
                      setOpenChat(true)
                    }}
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>

                  {/* Email Button */}
                  <button
                    className="flex-1 flex items-center justify-center gap-2 border border-border px-4 py-2 rounded-lg hover:scale-103 transition-transform"
                    onClick={() => {
                      window.location.href = `mailto:${mentor.email}?subject=Guidance Request`
                    }}
                  >
                    <Mail className="w-4 h-4" /> Email
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Dialog */}
      {openChat && selectedEmail && (
        <ChatDialog
          userEmail={email}
          peerEmail={selectedEmail}
          peerName={selectedMentor}
          onClose={() => setOpenChat(false)}
        />
      )}
    </div>
  )
}
