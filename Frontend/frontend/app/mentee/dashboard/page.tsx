"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSessions, getEnrollments, getCertificates, getNotifications } from "@/utils/api";
import { Spinner } from "../../../components/ui/spinner";
import type { Session, Enrollment, Certificate, Notification } from "@/types";
import { Calendar, BookOpen, Award, ArrowRight, Download, ExternalLink, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// MenteeDashboardEnhanced.tsx
// A polished, mentor-dashboard-inspired learning dashboard for mentees.
// Uses the same utils/api contract as the mentor dashboard and falls back to
// dummy data when API calls fail. Includes a robust certificate download
// helper that will attempt to provide a direct download link for common
// hosting providers (e.g. Google Drive) and falls back to opening the link.

export default function MenteeDashboardEnhanced() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "completed" | "upcoming">("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});


  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [sessionsData, enrollmentsData, certificatesData, notificationsData] = await Promise.all([
          getSessions(),
          getEnrollments(),
          getCertificates(),
          getNotifications(),
        ]);

        if (!mounted) return;

        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);
        setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (error) {
        console.error("Error loading mentee dashboard data:", error);
        // API layer already returns dummy data, so no manual fallback needed
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const isSessionNow = (session: Session) => {
    const start = new Date(session.dateTime).getTime();
    const now = Date.now();
    const end = start + (session.duration || 60) * 60 * 1000;
    return now >= start && now <= end;
  };

  // Derived filtered sessions for the list
  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sessions
      .filter((s) => {
        if (filter === "today") return isSameDay(new Date(s.dateTime), new Date());
        if (filter === "completed") return s.status?.toLowerCase() === "completed";
        if (filter === "upcoming") return new Date(s.dateTime).getTime() > Date.now();
        return true;
      })
      .filter((s) => {
        if (!q) return true;
        return (
          (s.courseName || "").toLowerCase().includes(q) ||
          (s.mentorName || "").toLowerCase().includes(q) ||
          (s.menteeName || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [sessions, searchQuery, filter]);


  function getDirectDownloadUrl(url: string) {
    try {
      const u = new URL(url);
      // Google Drive share links
      if (u.hostname.includes("drive.google.com")) {
        const parts = u.pathname.split("/").filter(Boolean);
        const fileIdIndex = parts.indexOf("d") >= 0 ? parts.indexOf("d") + 1 : -1;
        if (fileIdIndex > 0 && parts[fileIdIndex]) {
          const id = parts[fileIdIndex];
          return `https://drive.google.com/uc?export=download&id=${id}`;
        }
        // query param id
        const idParam = u.searchParams.get("id");
        if (idParam) return `https://drive.google.com/uc?export=download&id=${idParam}`;
      }

      // Dropbox: convert "dl=0" style links to dl=1
      if (u.hostname.includes("dropbox.com")) {
        if (u.searchParams.get("dl") === "0") {
          u.searchParams.set("dl", "1");
          return u.toString();
        }
        return u.toString();
      }

      // Fallback: return original
      return url;
    } catch (e) {
      return url;
    }
  }

  // Download handler that attempts a direct download and provides UX feedback.
  const downloadCertificate = async (cert: Certificate) => {
    if (!cert?.certificateUrl) return;
    setDownloading((prev) => ({ ...prev, [cert.id]: true }));
    try {
      const direct = getDirectDownloadUrl(cert.certificateUrl);
      const a = document.createElement("a");
      a.href = direct;

      // If URL appears to be from same-origin / direct download we can set download attr
      if (direct.includes("uc?export=download") || direct.includes("dl=1") || direct.match(/\.(pdf|png|jpg|jpeg)$/i)) {
        a.setAttribute("download", `${cert.courseName || 'certificate'}-${cert.id}.pdf`);
        a.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Open in new tab for providers that stream or require preview
        window.open(direct, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      // As fallback open original
      window.open(cert.certificateUrl, "_blank", "noopener,noreferrer");
    } finally {
      setTimeout(() => setDownloading((prev) => ({ ...prev, [cert.id]: false })), 600);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-muted">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm text-muted-foreground mt-1">Overview of your learning progress, sessions and certificates.</h4>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/mentee/explore-courses" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold">
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/mentee/request-session" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-primary font-semibold">
              Request Session
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
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
            <p className="text-xs text-muted-foreground">Scheduled sessions and live events</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                <p className="text-3xl font-bold text-foreground">{enrollments.length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Active enrollments and progress</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-3xl font-bold text-foreground">{certificates.length}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Earned course certificates</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg border-border p-6">
            <div className="bg-white rounded-lg border-border p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="relative w-full">
                    <div className="absolute left-3 top-2">
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sessions, mentors or courses..."
                      className="w-full border border-border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setFilter("all")} className={`px-3 py-2 rounded-lg ${filter === "all" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>All</button>
                    <button onClick={() => setFilter("today")} className={`px-3 py-2 rounded-lg ${filter === "today" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Today</button>
                    <button onClick={() => setFilter("upcoming")} className={`px-3 py-2 rounded-lg ${filter === "upcoming" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Upcoming</button>
                    <button onClick={() => setFilter("completed")} className={`px-3 py-2 rounded-lg ${filter === "completed" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>Completed</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Sessions</h2>
              <div className="text-sm text-muted-foreground">Sessions scheduled for the next 30 days</div>
            </div>

            {filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.map((session) => {
                  const startsAt = new Date(session.dateTime);
                  const startsAtStr = startsAt.toLocaleString();
                  const nowFlag = isSessionNow(session);
                  return (
                    <div key={session.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{session.courseName}</h3>
                          <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${session.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{session.status}</span>
                          <span className="text-xs text-muted-foreground">{startsAtStr}</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          Duration: <span className="font-medium text-foreground">{session.duration} mins</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a target="_blank" rel="noreferrer" href={session.googleMeetUrl || "#"} className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm">
                            Join Meet <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No sessions</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">My Certificates</h2>

              <Link
                href="/mentee/certificates"
                className="inline-flex items-center gap-2 text-primary font-semibold"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="p-4 rounded-lg border border-border flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{cert.courseName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Issued {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadCertificate(cert)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg font-semibold"
                          aria-label={`Download ${cert.courseName} certificate`}
                        >
                          {downloading[cert.id] ? (
                            <span className="text-xs">Downloading...</span>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span className="text-sm">Download</span>
                            </>
                          )}
                        </button>

                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm"
                        >
                          Preview <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Certificate ID: <span className="font-mono text-xs">{cert.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No certificates yet. Complete courses to earn certificates.
              </p>
            )}

            <hr className="my-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
