"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen, MessageSquare } from "lucide-react";
import { getCourses, getMentors, createSession } from "@/utils/api";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
];

export default function RequestSessionPage() {
  const [formData, setFormData] = useState({
    mentorId: "",
    courseId: "",
    date: "",
    time: "",
    duration: 60,
  });

  const [mentors, setMentors] = useState<{ id: string; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";
  const menteeName = typeof window !== "undefined" ? localStorage.getItem("userName") || "Student" : "";

  // ✅ Fetch mentors and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorsData, coursesData] = await Promise.all([
          getMentors(),
          getCourses(),
        ]);

        setMentors(
          mentorsData.map((mentor: any) => ({
            id: mentor.email || mentor.id,
            name: mentor.name,
          }))
        );

        setCourses(
          coursesData.map((course: any) => ({
            id: course.id,
            name: course.title,
          }))
        );
      } catch (error) {
        console.error("Failed to load mentors/courses:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.mentorId || !formData.courseId) return;

    setLoading(true);
    try {
      const selectedMentor = mentors.find((m) => m.id === formData.mentorId);
      const selectedCourse = courses.find((c) => c.id === formData.courseId);

      await createSession({
        mentorEmail: formData.mentorId,
        mentorName: selectedMentor?.name || "",
        menteeEmail: email,
        menteeName: menteeName,
        courseId: formData.courseId,
        courseName: selectedCourse?.name || "",
        dateTime: `${formData.date}T${formData.time}`,
        duration: formData.duration,
        status: "scheduled",
      });

      setSuccess(true);
      setFormData({ mentorId: "", courseId: "", date: "", time: "", duration: 60});
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to request session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mt-2">Schedule a new mentoring session with your mentor</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-border p-8">
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn mb-6">
              Session request sent successfully! Your mentor will confirm shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mentor */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Select Mentor
              </label>
              <select
                value={formData.mentorId}
                onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              >
                <option value="">Choose a mentor...</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Select Course
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Select Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Select Time
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              >
                <option value="">Choose a time...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number.parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                min={30}
                max={180}
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Sending Request..." : "Request Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
