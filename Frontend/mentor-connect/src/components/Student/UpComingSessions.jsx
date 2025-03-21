import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, User, CheckCircle, AlertCircle, Play, Monitor, Timer, X, BookOpenCheck } from "lucide-react";
import "./UpcomingSessions.css";

const UpcomingSession = () => {
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showMeetingDialog, setShowMeetingDialog] = useState(false);

    useEffect(() => {
        // This would be replaced with a real API call
        // For now, load from localStorage or use demo data
        const loadSchedules = () => {
            const confirmedSchedules = JSON.parse(localStorage.getItem('confirmedSchedules') || '[]');

            // If no schedules are found, create demo data
            if (confirmedSchedules.length === 0) {
                const demoData = generateDemoSessions();
                setUpcomingSessions(demoData);
                return;
            }

            // Filter and format confirmed schedules
            const upcoming = confirmedSchedules
                .filter(schedule => new Date(schedule.dateTime) > new Date())
                .map(schedule => ({
                    id: schedule.id,
                    studentName: schedule.studentName,
                    studentId: schedule.studentId,
                    courseName: schedule.courseName,
                    dateTime: new Date(schedule.dateTime),
                    duration: schedule.duration || 60, // Default to 60 minutes
                    notes: schedule.notes || ""
                }))
                .sort((a, b) => a.dateTime - b.dateTime);

            setUpcomingSessions(upcoming.slice(0, 5)); // Show only next 5 sessions
        };

        loadSchedules();
    }, []);

    // Generate some demo sessions for display
    const generateDemoSessions = () => {
        const now = new Date();
        const students = [
            { name: "Alex Johnson", id: "SID-001" },
            { name: "Maya Patel", id: "SID-002" },
            { name: "Carlos Rodriguez", id: "SID-003" },
            { name: "Emma Williams", id: "SID-004" },
            { name: "David Chen", id: "SID-005" }
        ];

        const courses = [
            "Data Science with Python",
            "Machine Learning Fundamentals",
            "Web Development",
            "Cybersecurity Basics",
            "Cloud Computing"
        ];

        return [
            {
                id: "sess-001",
                studentName: students[0].name,
                studentId: students[0].id,
                courseName: courses[0],
                dateTime: new Date(now.getTime() - 5 * 60000), // 5 minutes ago (in progress)
                duration: 60,
                notes: "Mid-term project discussion"
            },
            {
                id: "sess-002",
                studentName: students[1].name,
                studentId: students[1].id,
                courseName: courses[1],
                dateTime: new Date(now.getTime() + 5 * 60000), // 5 minutes from now
                duration: 45,
                notes: "Regression models review"
            },
            {
                id: "sess-003",
                studentName: students[2].name,
                studentId: students[2].id,
                courseName: courses[2],
                dateTime: new Date(now.getTime() + 60 * 60000), // 1 hour from now
                duration: 30,
                notes: "Project feedback"
            },
            {
                id: "sess-004",
                studentName: students[3].name,
                studentId: students[3].id,
                courseName: courses[3],
                dateTime: new Date(now.getTime() + 3 * 60 * 60000), // 3 hours from now
                duration: 60,
                notes: "Security concepts review"
            },
            {
                id: "sess-005",
                studentName: students[4].name,
                studentId: students[4].id,
                courseName: courses[4],
                dateTime: new Date(now.getTime() + 24 * 60 * 60000), // Tomorrow
                duration: 45,
                notes: "AWS solutions architect prep"
            }
        ];
    };

    // Determine session status based on time
    const getSessionStatus = (dateTime, duration) => {
        const now = new Date();
        const sessionStart = new Date(dateTime);
        const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);

        if (now >= sessionStart && now <= sessionEnd) {
            return "in-progress";
        } else if (now > sessionEnd) {
            return "completed";
        } else if (now >= new Date(sessionStart.getTime() - 10 * 60000)) {
            return "starting-soon"; // Within 10 minutes of start time
        } else {
            return "upcoming";
        }
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (date) => {
        if (!date) return "";
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Prepare for meeting
    const handleJoinMeeting = (session) => {
        setSelectedSession(session);
        setShowMeetingDialog(true);
    };

    // Start the online meeting
    const startMeeting = () => {
        // This would integrate with a video platform API like Zoom, Google Meet, etc.
        // For now we'll just close the dialog
        setShowMeetingDialog(false);
        navigate(`/mentor/join-meeting/${selectedSession.studentName}`);
    };

    // Calculate relative time display
    const getRelativeTimeDisplay = (dateTime) => {
        const now = new Date();
        const sessionTime = new Date(dateTime);
        const diffMs = sessionTime - now;
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins < 0) {
            return `Started ${Math.abs(diffMins)} mins ago`;
        } else if (diffMins < 60) {
            return `Starts in ${diffMins} mins`;
        } else if (diffMins < 24 * 60) {
            const hours = Math.floor(diffMins / 60);
            return `Starts in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        } else {
            const days = Math.floor(diffMins / (24 * 60));
            return `In ${days} ${days === 1 ? 'day' : 'days'}`;
        }
    };

    return (
        <div className="upcoming-session-container">
            <div className="upcoming-session-list">
                <h2>Upcoming Sessions</h2>
                <p className="subtitle">Your scheduled mentoring sessions</p>
                {upcomingSessions.length > 0 ? (
                    upcomingSessions.map(session => {
                        const status = getSessionStatus(session.dateTime, session.duration);
                        return (
                            <div key={session.id} className={`session-card ${status}`}>
                                <div className="session-content">
                                    <div className="session-header">
                                        <h3>{session.courseName}</h3>
                                        <div className={`session-status ${status}`}>
                                            {status === "in-progress" && (
                                                <>
                                                    <Play size={14} fill="currentColor" />
                                                    In Progress
                                                </>
                                            )}
                                            {status === "starting-soon" && (
                                                <>
                                                    <Timer size={14} />
                                                    Starting Soon
                                                </>
                                            )}
                                            {status === "upcoming" && (
                                                <>
                                                    <Calendar size={14} />
                                                    Upcoming
                                                </>
                                            )}
                                            {status === "completed" && (
                                                <>
                                                    <CheckCircle size={14} />
                                                    Completed
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="session-time">
                                        <div className="session-detail">
                                            <Calendar size={16} />
                                            {formatDate(session.dateTime)} at {formatTime(session.dateTime)}
                                        </div>
                                        <div className="session-detail">
                                            <Clock size={16} />
                                            {session.duration} minutes
                                        </div>
                                        <div className="session-detail">
                                            <User size={16} />
                                            {session.studentName}
                                        </div>
                                    </div>

                                    {session.notes && (
                                        <div className="session-notes">
                                            <h4>Session Notes</h4>
                                            <p>{session.notes}</p>
                                        </div>
                                    )}

                                    <div className="session-status-text">
                                        {getRelativeTimeDisplay(session.dateTime)}
                                    </div>
                                </div>

                                <div className="session-actions">
                                    {(status === "in-progress" || status === "starting-soon") && (
                                        <button
                                            className="join-meeting-btn"
                                            onClick={() => handleJoinMeeting(session)}
                                        >
                                            <Video size={16} /> Join Meeting
                                        </button>
                                    )}
                                    {status === "upcoming" && (
                                        <>
                                            <button
                                                className="join-meeting-btn"
                                                onClick={() => handleJoinMeeting(session)}
                                                disabled={new Date(session.dateTime) - new Date() > 10 * 60000}
                                            >
                                                <Video size={16} /> Join Meeting
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-sessions">
                        <Calendar size={40} />
                        <h3>No upcoming sessions</h3>
                        <p>You don't have any scheduled mentoring sessions yet.</p>
                        <button className="schedule-btn">
                            <Calendar size={16} /> Schedule a Session
                        </button>
                    </div>
                )}

                {upcomingSessions.length > 5 && (
                    <div className="more-sessions">
                        View all sessions <ArrowRight size={14} />
                    </div>
                )}
            </div>

            {/* Meeting Dialog */}
            {showMeetingDialog && selectedSession && (
                <div className="meeting-dialog">
                    <div className="meeting-dialog-content">
                        <div className="meeting-dialog-header">
                            <Video size={24} />
                            <h3>Start Mentoring Session</h3>
                        </div>
                        <div className="meeting-dialog-body">
                            <div className="meeting-info">
                                <div className="meeting-info-item">
                                    <User size={18} />
                                    <span>{selectedSession.studentName}</span>
                                </div>
                                <div className="meeting-info-item">
                                    <BookOpenCheck size={18} />
                                    <span>{selectedSession.courseName}</span>
                                </div>
                                <div className="meeting-info-item">
                                    <Calendar size={18} />
                                    <span>{formatDate(selectedSession.dateTime)} at {formatTime(selectedSession.dateTime)}</span>
                                </div>
                                <div className="meeting-info-item">
                                    <Clock size={18} />
                                    <span>{selectedSession.duration} minutes</span>
                                </div>
                            </div>
                            {selectedSession.notes && (
                                <div className="session-notes">
                                    <h4>Session Notes</h4>
                                    <p>{selectedSession.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="meeting-dialog-actions">
                            <button
                                className="cancel-meeting-btn"
                                onClick={() => setShowMeetingDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="start-meeting-btn"
                                onClick={startMeeting}
                            >
                                <Video size={18} /> Start Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingSession; 