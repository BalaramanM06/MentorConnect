export type UserRole = "MENTOR" | "MENTEE"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  expertise?: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  mentorEmail: string
  mentorName: string
  imageUrl?: string
  duration: number // in days
  fees: number
  certificateUrl?: string
  createdAt: string
}

export interface Enrollment {
  id: string
  courseId: string
  menteeEmail: string
  startDate: string | null
  completedAt: string | null
  status: "enrolled" | "pending" | "completed"
}

export interface Session {
  id: string
  courseId: string
  mentorEmail: string
  menteeEmail: string
  mentorName: string
  menteeName: string
  courseName: string
  dateTime: string
  duration: number
  status: "scheduled" | "completed" | "cancelled"
  googleMeetUrl?: string
}

export interface Notification {
  id: string
  userId: string
  type: "session" | "enrollment" | "certificate" | "message"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface Certificate {
  id: string
  courseId: string
  courseName: string
  menteeEmail: string
  menteeName: string
  issuedAt: string
  certificateUrl: string
}

export interface Review {
  id: string;
  menteeName: string;
  menteeEmail?: string;
  courseId?: string;
  courseName: string;
  rating: number;
  comment: string;
  date: string;
}
