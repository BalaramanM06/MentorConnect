import React, { useState, useEffect } from "react";
import { Calendar, Clock, Check, X, Filter } from "lucide-react";
import "./CourseScheduling.css";

const CourseScheduling = () => {
    const [courseSchedules, setCourseSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // In a real app, this would be fetched from an API
        // Using localStorage for demo purposes
        const storedSchedules = JSON.parse(localStorage.getItem("courseSchedules") || "[]");

        // If no schedules in storage, create sample data
        if (storedSchedules.length === 0) {
            const sampleSchedules = [
                {
                    id: 1,
                    courseName: "Web Development Fundamentals",
                    studentName: "Alex Johnson",
                    studentId: "STU12345",
                    scheduleDate: "2023-06-20",
                    scheduleTime: "10:00",
                    duration: 60,
                    status: "accepted",
                    notification: true
                },
                {
                    id: 2,
                    courseName: "Data Science Essentials",
                    studentName: "Emily Chen",
                    studentId: "STU67890",
                    scheduleDate: "2023-06-22",
                    scheduleTime: "14:30",
                    duration: 90,
                    status: "pending",
                    notification: false
                },
                {
                    id: 3,
                    courseName: "Mobile App Development",
                    studentName: "Michael Smith",
                    studentId: "STU24680",
                    scheduleDate: "2023-06-25",
                    scheduleTime: "16:00",
                    duration: 45,
                    status: "accepted",
                    notification: true
                },
                {
                    id: 4,
                    courseName: "Cloud Computing Basics",
                    studentName: "Sarah Williams",
                    studentId: "STU13579",
                    scheduleDate: "2023-06-18",
                    scheduleTime: "09:00",
                    duration: 60,
                    status: "rejected",
                    notification: false
                }
            ];

            localStorage.setItem("courseSchedules", JSON.stringify(sampleSchedules));
            setCourseSchedules(sampleSchedules);
        } else {
            setCourseSchedules(storedSchedules);
        }
    }, []);

    useEffect(() => {
        let filtered = [...courseSchedules];

        // Apply status filter
        if (filterStatus !== "all") {
            filtered = filtered.filter(schedule => schedule.status === filterStatus);
        }

        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(schedule =>
                schedule.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                schedule.studentName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredSchedules(filtered);
    }, [courseSchedules, filterStatus, searchTerm]);

    const handleStatusChange = (id, newStatus) => {
        const updatedSchedules = courseSchedules.map(schedule => {
            if (schedule.id === id) {
                return { ...schedule, status: newStatus, notification: true };
            }
            return schedule;
        });

        setCourseSchedules(updatedSchedules);
        localStorage.setItem("courseSchedules", JSON.stringify(updatedSchedules));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "accepted": return "status-accepted";
            case "pending": return "status-pending";
            case "rejected": return "status-rejected";
            default: return "";
        }
    };

    return (
        <div className="course-scheduling-container">
            <div className="scheduling-header">
                <h2>Course Scheduling</h2>
                <div className="filters">
                    <div className="search-input">
                        <input
                            type="text"
                            placeholder="Search courses or students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="status-filter">
                        <Filter size={16} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="accepted">Accepted</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="scheduling-list">
                {filteredSchedules.length > 0 ? (
                    filteredSchedules.map(schedule => (
                        <div key={schedule.id} className={`schedule-card ${getStatusColor(schedule.status)}`}>
                            <div className="schedule-info">
                                <h3>{schedule.courseName}</h3>
                                <p className="student-info">Student: {schedule.studentName} ({schedule.studentId})</p>

                                <div className="schedule-details">
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>{formatDate(schedule.scheduleDate)}</span>
                                    </div>

                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{schedule.scheduleTime} ({schedule.duration} mins)</span>
                                    </div>
                                </div>

                                <div className="status-badge">
                                    {schedule.status === "accepted" && (
                                        <span className="status accepted">Accepted</span>
                                    )}
                                    {schedule.status === "pending" && (
                                        <span className="status pending">Pending</span>
                                    )}
                                    {schedule.status === "rejected" && (
                                        <span className="status rejected">Rejected</span>
                                    )}
                                </div>
                            </div>

                            {schedule.status === "pending" && (
                                <div className="action-buttons">
                                    <button
                                        className="accept-btn"
                                        onClick={() => handleStatusChange(schedule.id, "accepted")}
                                    >
                                        <Check size={16} />
                                        Accept
                                    </button>

                                    <button
                                        className="reject-btn"
                                        onClick={() => handleStatusChange(schedule.id, "rejected")}
                                    >
                                        <X size={16} />
                                        Reject
                                    </button>
                                </div>
                            )}

                            {schedule.status !== "pending" && (
                                <div className="action-buttons">
                                    <button className="view-btn">View Details</button>
                                    {schedule.status === "accepted" && (
                                        <button className="reschedule-btn">Reschedule</button>
                                    )}
                                </div>
                            )}

                            {schedule.notification && (
                                <div className="notification-badge">
                                    <span>New</span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-schedules">
                        <Calendar size={48} />
                        <h3>No schedules found</h3>
                        <p>
                            {filterStatus !== "all"
                                ? `No ${filterStatus} schedules available.`
                                : searchTerm
                                    ? "No schedules match your search criteria."
                                    : "You don't have any scheduled courses yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseScheduling; 