"use client"

import type React from "react"
import Link from "next/link";
import { useEffect, useState } from "react"
import { getCourses, createCourse, deleteCourse, updateCourse } from "@/utils/api" // ✅ added updateCourse
import type { Course } from "@/types"
import { Plus, Trash2, Edit2 } from "lucide-react"
import { i } from "node_modules/framer-motion/dist/types.d-BJcRxCew"

export default function MentorCoursesPage() {
  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    duration: 30,
    fees: 299,
  })

  useEffect(() => {
    loadCourses()
  }, [])

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

  // ✅ Handle Add / Edit Course Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCourse) {
        // Update existing course
        const updated = await updateCourse(editingCourse.id, {
          ...formData,
          mentorEmail: email,
          mentorName: "John Doe",
        })
        setCourses(courses.map((c) => (c.id === editingCourse.id ? updated : c)))
      } else {
        // Add new course
        const newCourse = await createCourse({
          ...formData,
          mentorEmail: email,
          mentorName: "John Doe",
        })
        setCourses([...courses, newCourse])
      }

      // Reset modal + form
      setShowModal(false)
      setEditingCourse(null)
      setFormData({ title: "", description: "", imageUrl: "", duration: 30, fees: 299 })
    } catch (error) {
      console.error("Failed to save course:", error)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId) ;
      setCourses(courses.filter((c) => c.id !== courseId)) ;
    } catch (error) {
      console.error("Failed to delete course:", error)
    }
  }

  const handleEditClick = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl || "",
      duration: course.duration,
      fees: course.fees,
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCourse(null)
    setFormData({ title: "", description: "", imageUrl: "", duration: 30, fees: 299 })
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          {/* Left Section */}
          <div>
            <p className="text-muted-foreground mt-2">Manage your courses and content</p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Link
              href="/mentor/reviews"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-primary font-semibold hover:bg-primary/1 transition"
            >
              <span>View Reviews</span>
            </Link>

            <button
              onClick={() => {
                setEditingCourse(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-102"
            >
              <Plus className="w-5 h-5" /> Add Course
            </button>
          </div>
        </div>


        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg border border-border overflow-hidden transition-transform duration-300 hover:scale-[1.03] flex flex-col"
              style={{ minHeight: "400px" }} // same height as mentee cards
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
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {course.description.length > 200
                    ? course.description.slice(0, 200) + "..."
                    : course.description}
                </p>

                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="font-semibold text-primary">${course.fees}</span>
                  <span className="text-muted-foreground">{course.duration} days</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="flex-1 flex items-center justify-center gap-2 border border-border px-3 py-2 rounded-lg transition-transform duration-300 hover:scale-[1.05]"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="flex-1 flex items-center justify-center gap-2 border border-error text-error px-3 py-2 rounded-lg transition-transform duration-300 hover:scale-[1.05]"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>

          ))}
        </div>

        {/* Add/Edit Course Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Course Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    required
                  />
                </div>

                {/* Image URL (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Course Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Duration + Fees */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Fees ($)</label>
                    <input
                      type="number"
                      value={formData.fees}
                      onChange={(e) =>
                        setFormData({ ...formData, fees: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingCourse ? "Save Changes" : "Create Course"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
