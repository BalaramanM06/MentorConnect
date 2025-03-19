import React, { useState, useEffect } from "react";
import { Calendar, Clock, X, Video, CheckCircle } from "lucide-react";
import "./MentorScheduling.css";

const MentorScheduling = () => {
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [todaySessions, setTodaySessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showMeetingDialog, setShowMeetingDialog] = useState(false);

    useEffect(() => {
        // Load schedules from storage
        const savedSchedules = JSON.parse(localStorage.getItem("mentorSchedules") || "[]");

        // Get confirmed schedules
        const confirmedSchedules = savedSchedules.filter(schedule => schedule.status === "confirmed");

        // Current date for comparison
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Sort sessions by date and time
        confirmedSchedules.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }
            return a.time.localeCompare(b.time);
        });

        // Sessions for today
        const todaySessionsList = confirmedSchedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate.toDateString() === today.toDateString();
        });

        // Upcoming sessions (today and later)
        const upcomingSessionsList = confirmedSchedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            return scheduleDate >= today;
        });

        setTodaySessions(todaySessionsList);
        setUpcomingSessions(upcomingSessionsList);
    }, []);

    // Function to get session status based on time
    const getSessionStatus = (session) => {
        const now = new Date();
        const sessionDate = new Date(session.date);
        const sessionTime = session.time.split(':');
        const sessionDateTime = new Date(
            sessionDate.getFullYear(),
            sessionDate.getMonth(),
            sessionDate.getDate(),
            parseInt(sessionTime[0]),
            parseInt(sessionTime[1] || 0)
        );

        // Calculate session end time
        const sessionEndTime = new Date(sessionDateTime);
        sessionEndTime.setMinutes(sessionEndTime.getMinutes() + session.duration);

        // Time until session starts (in minutes)
        const minutesUntilStart = Math.floor((sessionDateTime - now) / 60000);

        if (now >= sessionDateTime && now < sessionEndTime) {
            return { status: "in-progress", label: "In Progress", canJoin: true };
        } else if (now > sessionEndTime) {
            return { status: "completed", label: "Completed", canJoin: false };
        } else if (minutesUntilStart <= 10) {
            return { status: "starting-soon", label: "Starting Soon", canJoin: true };
        } else {
            return { status: "upcoming", label: "Upcoming", canJoin: false };
        }
    };

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getFormattedTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        return `${hour > 12 ? hour - 12 : hour}:${minutes || '00'} ${hour >= 12 ? 'PM' : 'AM'}`;
    };

    const handleJoinMeeting = (session) => {
        setSelectedSession(session);
        setShowMeetingDialog(true);
    };

    const startOnlineMeeting = () => {
        // In a real implementation, this would connect to socket.io
        // and set up a video call room

        // For demo, let's just simulate redirecting to a meeting room
        alert(`Starting online meeting for ${selectedSession.course}. In a real implementation, this would connect to socket.io for video conferencing.`);

        // Update the session status as in-progress in localStorage
        const savedSchedules = JSON.parse(localStorage.getItem("mentorSchedules") || "[]");
        const updatedSchedules = savedSchedules.map(schedule => {
            if (schedule.id === selectedSession.id) {
                return { ...schedule, meetingStarted: true };
            }
            return schedule;
        });
        localStorage.setItem("mentorSchedules", JSON.stringify(updatedSchedules));

        setShowMeetingDialog(false);
    };

    return (
        <div className="mentor-scheduling-container">
            <h2>Upcoming Sessions</h2>
            <p className="subtitle">View and join your scheduled sessions</p>

            {todaySessions.length > 0 && (
                <div className="today-sessions">
                    <h3>Today's Sessions</h3>
                    <div className="session-list">
                        {todaySessions.map((session) => {
                            const sessionStatus = getSessionStatus(session);
                            return (
                                <div key={session.id} className={`session-card ${sessionStatus.status}`}>
                                    <div className="session-time-badge">
                                        {getFormattedTime(session.time)}
                                    </div>
                                    <div className="session-details">
                                        <h4>{session.course}</h4>
                                        <div className="session-info">
                                            <Clock size={16} />
                                            <span>{getFormattedTime(session.time)} - {session.duration} mins</span>
                                        </div>
                                        <div className="session-info">
                                            <Calendar size={16} />
                                            <span>{getFormattedDate(session.date)}</span>
                                        </div>
                                        <div className="session-status-badge">
                                            {sessionStatus.label}
                                        </div>
                                    </div>
                                    <div className="session-actions">
                                        {sessionStatus.canJoin && (
                                            <button
                                                className="join-meeting-btn"
                                                onClick={() => handleJoinMeeting(session)}
                                            >
                                                <Video size={18} />
                                                Join Meeting
                                            </button>
                                        )}
                                        {!sessionStatus.canJoin && sessionStatus.status === "upcoming" && (
                                            <div className="time-until">Starts in {Math.floor((new Date(session.date + ' ' + session.time) - new Date()) / 60000)} minutes</div>
                                        )}
                                        {sessionStatus.status === "completed" && (
                                            <div className="completed-badge">
                                                <CheckCircle size={18} />
                                                Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="upcoming-sessions">
                <h3>All Upcoming Sessions</h3>
                {upcomingSessions.length > 0 ? (
                    <div className="session-list">
                        {upcomingSessions.map((session) => {
                            const sessionStatus = getSessionStatus(session);
                            return (
                                <div key={session.id} className={`session-card ${sessionStatus.status}`}>
                                    <div className="session-time-badge">
                                        {getFormattedTime(session.time)}
                                    </div>
                                    <div className="session-details">
                                        <h4>{session.course}</h4>
                                        <div className="session-info">
                                            <Clock size={16} />
                                            <span>{getFormattedTime(session.time)} - {session.duration} mins</span>
                                        </div>
                                        <div className="session-info">
                                            <Calendar size={16} />
                                            <span>{getFormattedDate(session.date)}</span>
                                        </div>
                                        <div className="session-status-badge">
                                            {sessionStatus.label}
                                        </div>
                                    </div>
                                    <div className="session-actions">
                                        {sessionStatus.canJoin && (
                                            <button
                                                className="join-meeting-btn"
                                                onClick={() => handleJoinMeeting(session)}
                                            >
                                                <Video size={18} />
                                                Join Meeting
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-sessions">
                        <p>You don't have any upcoming sessions.</p>
                    </div>
                )}
            </div>

            {showMeetingDialog && selectedSession && (
                <div className="meeting-dialog-overlay">
                    <div className="meeting-dialog">
                        <h3>Start Online Meeting</h3>
                        <p>You are about to start an online meeting for:</p>
                        <div className="meeting-details">
                            <strong>{selectedSession.course}</strong>
                            <div>
                                <Clock size={16} />
                                <span>{getFormattedTime(selectedSession.time)} - {selectedSession.duration} mins</span>
                            </div>
                            <div>
                                <Calendar size={16} />
                                <span>{getFormattedDate(selectedSession.date)}</span>
                            </div>
                        </div>
                        <p className="meeting-info">
                            This will create a video session using socket.io. Make sure your camera and microphone are working properly.
                        </p>
                        <div className="meeting-actions">
                            <button
                                className="cancel-meeting-btn"
                                onClick={() => setShowMeetingDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="start-meeting-btn"
                                onClick={startOnlineMeeting}
                            >
                                <Video size={18} />
                                Start Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorScheduling; 