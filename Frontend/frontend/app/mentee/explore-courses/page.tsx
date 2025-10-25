"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCourses, enrollCourse } from "@/utils/api"
import type { Course } from "@/types"
import { DollarSign, Clock, CheckCircle } from "lucide-react"

export default function EnrollCoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error("Failed to load courses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollCourse(courseId, "user-4")
      setEnrolledCourses([...enrolledCourses, courseId])
    } catch (error) {
      console.error("Failed to enroll:", error)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Explore Courses</h2>
            <p className="text-muted-foreground mt-2">
              Find and enroll in courses from expert mentors
            </p>
          </div>

          <Link
            href="/mentee/reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold transition-transform duration-300 hover:scale-[1.03]"
          >
            View My Reviews
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.01] flex flex-col"
              style={{ minHeight: "400px" }}
            >
              {/* Course Image or Gradient */}
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="bg-gradient-to-r from-primary to-secondary h-32"></div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {truncateText(course.description, 200)}
                </p>
                <p className="text-sm text-muted-foreground mb-4">by {course.mentorName}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" /> {course.duration} days
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <DollarSign className="w-4 h-4" /> ${course.fees}
                  </div>
                </div>

                {/* Button at bottom */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolledCourses.includes(course.id)}
                    className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform duration-300 ${
                      enrolledCourses.includes(course.id)
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-primary text-white hover:scale-[1.02]"
                    }`}
                  >
                    {enrolledCourses.includes(course.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Enrolled
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
