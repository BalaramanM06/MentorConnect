import axios from "axios"
import { API_BASE_URL, USE_DUMMY_DATA } from "@/config/appConfig"
import {
  dummyCourses,
  dummyEnrollments,
  dummySessions,
  dummyNotifications,
  dummyCertificates,
  dummyStudents,
  dummyCurrentUser,
  dummyMentors,
  dummyReviews,
} from "./dummyData"
import type { Course, Enrollment, Session, Notification, Certificate, User, Review } from "@/types"



const api = axios.create({ baseURL: API_BASE_URL })
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";


api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getCurrentUser = async (): Promise<User> => {
  if (USE_DUMMY_DATA) return dummyCurrentUser;
  const { data } = await api.post(
    "/user/get-profile",
    { email },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  if (USE_DUMMY_DATA) return dummyCourses
  const { data } = await api.get("/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export const searchCourses = async (query: string): Promise<Course[]> => {
  if (USE_DUMMY_DATA) {
    return dummyCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()),
    )
  }
  const { data } = await api.get(`/courses/search?q=${query}` , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data
}

export const createCourse = async (course: Omit<Course, "id" | "createdAt">): Promise<Course> => {
  if (USE_DUMMY_DATA) {
    return { ...course, id: `course-${Date.now()}`, createdAt: new Date().toISOString() }
  }
  const { data } = await api.post("/courses",
    { email , course },
    {
      headers: { Authorization: `Bearer ${token}` },
    });
  return data
}

export const updateCourse = async (id: string, course: Partial<Omit<Course, "id" | "createdAt">>) : Promise<Course> => {
  if (USE_DUMMY_DATA) {
    return { ...course, id, createdAt: new Date().toISOString() } as Course
  }

  const { data } = await api.put(`/courses/${id}`,
    { email , course },
    {
      headers: { Authorization: `Bearer ${token}` },
    })
  return data
}


export const deleteCourse = async (courseId: string): Promise<void> => {
  if (USE_DUMMY_DATA) return
  await api.delete(`/courses/${courseId}`, { data: { email } }) ;
}

// Enrollments
export const getEnrollments = async (): Promise<Enrollment[]> => {
  if (USE_DUMMY_DATA) return dummyEnrollments
  const { data } = await api.get("/enrollments" ,
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email }
    }  
  );
  return data
}

export const enrollCourse = async (courseId: string, menteeEmail: string): Promise<Enrollment> => {
  if (USE_DUMMY_DATA) {
    return {
      id: `enroll-${Date.now()}`,
      courseId,
      menteeEmail,
      startDate: null,
      completedAt: null,
      status: "enrolled",
    }
  }
  const { data } = await api.post("/enrollments",
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { courseId, menteeEmail , mentorEmail: email }
    } )
  return data
}


export const createSession = async (session: Omit<Session, "id">): Promise<Session> => {
  if (USE_DUMMY_DATA) {
    return { ...session, id: `session-${Date.now()}` }
  }
  const { data } = await api.post("/sessions",
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email , session }
    } )
  return data
}

// Notifications
export const getNotifications = async (): Promise<Notification[]> => {
  if (USE_DUMMY_DATA) return dummyNotifications
  const { data } = await api.get("/notifications",
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email }
    } 
  );
  return data
}

// Certificates
export const getCertificates = async (): Promise<Certificate[]> => {
  if (USE_DUMMY_DATA) return dummyCertificates
  const { data } = await api.get("/certificates" ,
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email }
    } )
  return data
}

// Students
export const getStudents = async (): Promise<User[]> => {
  if (USE_DUMMY_DATA) return dummyStudents
  const { data } = await api.get("/students" ,
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email }
    } )
  return data
}

export const getMentors = async (): Promise<User[]> => {
  if (USE_DUMMY_DATA) return dummyMentors
  const { data } = await api.get("/mentors" ,
    {
      headers: { Authorization: `Bearer ${token}` },      
      params: { email }
    } )
  return data
}


export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  role: "MENTOR" | "MENTEE"
): Promise<{ token: string }> {
  const { data } = await api.post("/auth/signup", { name, email, password, role });
  return data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

export const getSessions = async (): Promise<Session[]> => {
  if (USE_DUMMY_DATA) return dummySessions;
  const { data } = await api.get("/sessions");
  return data;
};

export const getSessionById = async (sessionId: string): Promise<Session> => {
  if (USE_DUMMY_DATA) {
    const session = dummySessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  }
  const { data } = await api.get(`/sessions/${sessionId}`);
  return data;
};


export const getReviews = async (): Promise<Review[]> => {
  if (USE_DUMMY_DATA) return dummyReviews

  const { data } = await api.get("/reviews")
  return data
}


export const getReviewById = async (reviewId: string): Promise<Review> => {
  if (USE_DUMMY_DATA) {
    const review = dummyReviews.find((r) => r.id === reviewId)
    if (!review) throw new Error("Review not found")
    return review
  }

  const { data } = await api.get(`/reviews/${reviewId}`)
  return data
}


export const getReviewsByMentee = async (): Promise<Review[]> => {
  if (USE_DUMMY_DATA) return dummyReviews

  const res = await fetch("/api/reviews/mentee")
  if (!res.ok) throw new Error("Failed to fetch reviews")
  return res.json()
}

export const updateReview = async (id: string, data: Partial<Review>): Promise<Review> => {
  if (USE_DUMMY_DATA) {
    return { ...data, id, date: new Date().toISOString() } as Review
  }

  const res = await fetch(`/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update review")
  return res.json()
}

export const deleteReview = async (id: string): Promise<boolean> => {
  if (USE_DUMMY_DATA) {
    return true
  }

  const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete review")
  return true
}