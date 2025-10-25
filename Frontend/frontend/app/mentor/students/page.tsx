"use client"

import { useEffect, useState } from "react"
import { getStudents } from "@/utils/api"
import ChatDialog from "../../../components/ChatDialog"
import type { User } from "@/types"
import { MessageSquare, Mail } from "lucide-react"

export default function MentorStudentsPage() {
  const email = localStorage.getItem("userEmail") || "" ;
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedEmail, setSelectedEmail] = useState("")

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents()
        setStudents(data)
      } catch (error) {
        console.error("Failed to load students:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-muted-foreground mt-2">Manage and communicate with your students</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gradient-to-r from-primary to-secondary h-24"></div>
              <div className="p-6 -mt-12 relative">
                <img
                  src={student.avatar || "/placeholder.svg"}
                  alt={student.name}
                  className="w-16 h-16 rounded-full border-4 border-white mb-4"
                />
                <h3 className="text-lg font-bold text-foreground">{student.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{student.email}</p>
                <p className="text-sm text-muted-foreground mb-6">{student.bio}</p>
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:scale-103"
                    onClick={() => { setSelectedEmail(student.email); setOpenChat(true); setSelectedStudent(student.name); }}
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 border border-border px-4 py-2 rounded-lg hover:scale-103"
                    onClick={() => {
                      window.location.href = `mailto:${student.email}?subject=Mentoring Session`
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
      {openChat && selectedEmail && (
        <ChatDialog
          userEmail= {email}
          peerEmail={selectedEmail}
          peerName={selectedStudent}
          onClose={() => setOpenChat(false)}
        />
      )}
    </div>
  )
}
