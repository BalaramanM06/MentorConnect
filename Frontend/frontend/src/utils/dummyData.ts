import type { User, Course, Enrollment, Session, Notification, Certificate, Review } from "@/types"

export const dummyCurrentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  role: "MENTEE" ,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  bio: "Experienced software engineer with 10+ years in web development",
  expertise: ["React", "Node.js", "TypeScript"],
}

export const dummyCourses: Course[] = [
  {
    id: "course-1",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and best practices",
    mentorEmail: "user-1",
    mentorName: "John Doe",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTqkwuaNS_ZTSpNxnSKmqLVGRFFy-jz1UkBA&s",
    duration: 30,
    fees: 299,
    createdAt: new Date().toISOString(),
  },
  {
    id: "course-2",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js",
    mentorEmail: "user-2",
    mentorName: "Jane Smith",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFdN4srH59QccqdeLiY65KqPrwFXNZBpUpQ&s",
    duration: 45,
    fees: 399,
    createdAt: new Date().toISOString(),
  },
  {
    id: "course-3",
    title: "TypeScript Mastery",
    description: "Deep dive into TypeScript for production applications",
    mentorEmail: "user-3",
    mentorName: "Mike Johnson",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnCVStHMhMTI0_ukYtu6aQDcXQtLX0lezdIg&s",
    duration: 25,
    fees: 249,
    createdAt: new Date().toISOString(),
  },
]

export const dummyEnrollments: Enrollment[] = [
  {
    id: "enroll-1",
    courseId: "course-1",
    menteeEmail: "user-4",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    status: "pending",
  },
  {
    id: "enroll-2",
    courseId: "course-2",
    menteeEmail: "user-4",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: null,
    status: "enrolled",
  },
]

export const dummySessions: Session[] = [
  {
    id: "session-1",
    courseId: "course-1",
    mentorEmail: "user-1",
    menteeEmail: "user-4",
    mentorName: "John Doe",
    menteeName: "Alice Brown",
    courseName: "Advanced React Patterns",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: "scheduled",
    googleMeetUrl: "https://meet.google.com/gmr-eunq-pjm",
  },
  {
    id: "session-2",
    courseId: "course-2",
    mentorEmail: "user-2",
    menteeEmail: "user-4",
    mentorName: "Jane Smith",
    menteeName: "Bob Wilson",
    courseName: "Node.js Backend Development",
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    status: "scheduled",
    googleMeetUrl: "https://meet.google.com/gmr-eunq-pjm",
  },
]

export const dummyNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "enrollment",
    title: "New Enrollment",
    message: "Alice Brown enrolled in your Advanced React Patterns course",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "session",
    title: "Session Scheduled",
    message: "Your session with Bob Wilson is confirmed for tomorrow",
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
]

export const dummyCertificates: Certificate[] = [
  {
    id: "cert-1",
    courseId: "course-1",
    courseName: "Advanced React Patterns",
    menteeEmail: "user-4",
    menteeName: "Alice Brown",
    issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    certificateUrl: "https://drive.google.com/file/d/1nh_iBu70lfTxK5kjgd1NPStlC4Leexo5/view?usp=sharing",
  },
  {
    id: "cert-2",
    courseId: "course-2",
    courseName: "Learn GoLang with Java",
    menteeEmail: "user-5",
    menteeName: "Bob Wilson",
    issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    certificateUrl: "https://drive.google.com/file/d/1nh_iBu70lfTxK5kjgd1NPStlC4Leexo5/view?usp=sharing",
  },
  {
    id: "cert-3",
    courseId: "course-2",
    courseName: "Learn GoLang with Java",
    menteeEmail: "user-5",
    menteeName: "Bob Wilson",
    issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    certificateUrl: "https://drive.google.com/file/d/1nh_iBu70lfTxK5kjgd1NPStlC4Leexo5/view?usp=sharing",
  },
  {
    id: "cert-4",
    courseId: "course-2",
    courseName: "Learn GoLang with Java",
    menteeEmail: "user-5",
    menteeName: "Bob Wilson",
    issuedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    certificateUrl: "https://drive.google.com/file/d/1nh_iBu70lfTxK5kjgd1NPStlC4Leexo5/view?usp=sharing",
  },
]

export const dummyStudents: User[] = [
  {
    id: "user-4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "MENTEE",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    bio: "Aspiring full-stack developer",
  },
  {
    id: "user-5",
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "MENTEE",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    bio: "Learning web development",
  },
]

export const dummyMentors: User[] = [
  {
    id: "user-6",
    name: "John Doe",
    email: "john@example.com",
    role: "MENTOR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    bio: "Professional full-stack developer",
  },
  {
    id: "user-7",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "MENTOR",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    bio: "Professional web development",
  },
]


export const dummyReviews: Review[] = [
  {
    id: "r1",
    menteeName: "Aarav Sharma",
    courseName: "React Fundamentals",
    rating: 5,
    comment: "The sessions were engaging and well-structured. Loved the clarity!",
    date: "2025-10-18T12:30:00Z",
  },
  {
    id: "r2",
    menteeName: "Diya Patel",
    courseName: "Advanced Java Concepts",
    rating: 4,
    comment: "Very informative and detailed course. Could use more examples though.",
    date: "2025-10-10T10:00:00Z",
  },
  {
    id: "r3",
    menteeName: "Rahul Verma",
    courseName: "Spring Boot Masterclass",
    rating: 5,
    comment: "Excellent mentorship and practical guidance!",
    date: "2025-09-30T09:15:00Z",
  },
]