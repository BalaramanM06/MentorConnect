"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, BookOpen } from "lucide-react";
import { getCourses, getStudents, createSession } from "@/utils/api";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00"
];

export default function ScheduleSessionPage() {
  // ✅ formData should include courseId + menteeId, not names
  const [formData, setFormData] = useState({
    courseId: "",
    menteeId: "",
    date: "",
    time: "",
    duration: 60
  });

  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "";
  const mentorName = typeof window !== "undefined" ? localStorage.getItem("userName") || "Mentor" : "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Fetch courses and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        const studentsData = await getStudents();

        setCourses(
          coursesData.map((course: any) => ({
            id: course.id,
            name: course.title,
          }))
        );
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch courses/students:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle submit with proper fields matching your Session type
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) return;

    setLoading(true);
    try {
      // Find selected names for clarity and consistency
      const selectedCourse = courses.find(c => c.id === formData.courseId);
      const selectedMentee = students.find(s => s.id === formData.menteeId);

      await createSession({
        mentorEmail: email, // or real mentorId from auth
        mentorName: mentorName,
        menteeEmail: formData.menteeId,
        menteeName: selectedMentee?.name || "",
        courseId: formData.courseId,
        courseName: selectedCourse?.name || "",
        dateTime: `${formData.date}T${formData.time}`,
        duration: formData.duration,
        status: "scheduled",
      });

      setSuccess(true);
      setFormData({ courseId: "", menteeId: "", date: "", time: "", duration: 60 });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to schedule session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mt-2">Create a new mentoring session</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-border p-8">
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn mb-6">
              Session scheduled successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            {/* Student */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Select Student
              </label>
              <select
                value={formData.menteeId}
                onChange={(e) => setFormData({ ...formData, menteeId: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-colors"
                required
              >
                <option value="">Choose a student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                {loading ? "Scheduling..." : "Schedule Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
