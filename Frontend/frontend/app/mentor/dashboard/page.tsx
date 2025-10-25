"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSessions, getCourses, getStudents, getNotifications } from "@/utils/api";
import { Spinner } from "../../../components/ui/spinner";
import type { Session, Course, User, Notification } from "@/types";
import { Calendar, BookOpen, Users, Bell, ArrowRight, Play, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function MentorDashboardEnhanced() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [joinedSessions, setJoinedSessions] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");


  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionsData, coursesData, studentsData, notificationsData] = await Promise.all([
          getSessions(),
          getCourses(),
          getStudents(),
          getNotifications(),
        ]);
        setSessions(sessionsData || []);
        setCourses(coursesData || []);
        setStudents(studentsData || []);
        setNotifications(notificationsData || []);
      } catch (error) {
        setSessions([]);
        setCourses([]);
        setStudents([]);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const isSessionNow = (session: Session) => {
    const start = new Date(session.dateTime).getTime();
    const now = Date.now();
    const end = start + (session.duration || 60) * 60 * 1000;
    return now >= start && now <= end;
  };

  const openAttendModal = (session: Session) => {
    setSelectedSession(session);
    setAttendModalOpen(true);
  };

  const closeAttendModal = () => {
    setSelectedSession(null);
    setAttendModalOpen(false);
  };

  const handleConfirmAttend = () => {
    if (!selectedSession) return;
    setJoinedSessions((prev) => ({ ...prev, [selectedSession.id]: true }));
    closeAttendModal();
    const joinUrl = selectedSession.googleMeetUrl || "#";
    window.open(joinUrl, "_blank", "noopener,noreferrer");
  };

  const filteredSessions = sessions
    .filter((s) =>
      filter === "today"
        ? isSameDay(new Date(s.dateTime), new Date())
        : filter === "upcoming"
        ? new Date(s.dateTime).getTime() > Date.now()
        : true
    )
    .filter((s) =>
      searchQuery.trim()
        ? (s.courseName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.menteeName || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  function isSameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  if (loading) {
    return <div className="text-center">
      <Spinner />
    </div>;
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground mt-1">Quick overview of your sessions, courses and students.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Link
              href="/mentor/schedule-session"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              <span>Schedule Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/mentor/courses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-primary font-semibold hover:bg-primary/10 transition"
            >
              Manage Courses
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-foreground">{sessions.length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Sessions scheduled across all your courses</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Courses</p>
                <p className="text-3xl font-bold text-foreground">{courses.length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Active and draft courses</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Students</p>
                <p className="text-3xl font-bold text-foreground">{students.length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Students enrolled in your courses</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-3xl font-bold text-foreground">{notifications.filter((n) => !n.read).length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Unread notifications</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg border-border p-6">
            <div className="bg-white rounded-lg border-border p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative w-full">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sessions or mentees..."
                      className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setFilter("all")} className={`px-3 py-2 rounded-lg ${filter === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>All</button>
                    <button onClick={() => setFilter("today")} className={`px-3 py-2 rounded-lg ${filter === "today" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Today</button>
                    <button onClick={() => setFilter("upcoming")} className={`px-3 py-2 rounded-lg ${filter === "upcoming" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Upcoming</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Upcoming Sessions</h2>
              <div className="text-sm text-muted-foreground">Sessions scheduled for the next 30 days</div>
            </div>

            {filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.map((session) => {
                  const startsAt = new Date(session.dateTime);
                  const startsAtStr = startsAt.toLocaleString();
                  const nowFlag = isSessionNow(session);
                  const joined = Boolean(joinedSessions[session.id]);
                  return (
                    <div key={session.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{session.courseName}</h3>
                          <p className="text-sm text-muted-foreground">with {session.menteeName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{session.status}</span>
                          <span className="text-xs text-muted-foreground">{startsAtStr}</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          Duration: <span className="font-medium text-foreground">{session.duration} mins</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a target="_blank" rel="noreferrer" href={session.googleMeetUrl || "https://meet.google.com/gmr-eunq-pjm"} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm">
                            Open Meet <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming sessions</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Notifications</h2>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 10).map((notif) => (
                  <div key={notif.id} className={`p-4 rounded-lg border ${notif.read ? "bg-muted border-border" : "bg-blue-50 border-blue-200"}`}>
                    <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No notifications</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
