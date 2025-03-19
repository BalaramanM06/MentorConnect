import React, { useState, useEffect } from "react";
import { Search, Clock, Calendar, Users, BookOpen } from "lucide-react";
import "./Courses.css";

const OngoingCourse = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);

    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem("mentorOngoingCourses") || "[]");

        if (storedCourses.length === 0) {
            const sampleCourses = [
                {
                    id: 1,
                    title: "Web Development Fundamentals",
                    student: "Alex Johnson",
                    studentId: "STU12345",
                    progress: 65,
                    nextSession: "2023-06-15T14:00:00",
                    totalSessions: 12,
                    completedSessions: 8,
                    category: "Web Development",
                    enrollmentDate: "2023-05-01"
                },
                {
                    id: 2,
                    title: "Data Science Essentials",
                    student: "Emily Chen",
                    studentId: "STU67890",
                    progress: 30,
                    nextSession: "2023-06-14T10:00:00",
                    totalSessions: 15,
                    completedSessions: 4,
                    category: "Data Science",
                    enrollmentDate: "2023-05-15"
                },
                {
                    id: 3,
                    title: "Mobile App Development",
                    student: "Michael Smith",
                    studentId: "STU24680",
                    progress: 80,
                    nextSession: "2023-06-16T16:00:00",
                    totalSessions: 10,
                    completedSessions: 8,
                    category: "Mobile Development",
                    enrollmentDate: "2023-04-20"
                }
            ];

            localStorage.setItem("mentorOngoingCourses", JSON.stringify(sampleCourses));
            setCourses(sampleCourses);
        } else {
            setCourses(storedCourses);
        }
    }, []);

    useEffect(() => {
        // Filter courses based on search term
        const filtered = courses.filter(
            course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="ongoing-courses-container">
            <div className="ongoing-courses-header">
                <h2>Ongoing Courses</h2>
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search courses or students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="courses-stats">
                <div className="stat-item">
                    <div className="stat-icon students">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{courses.length}</h3>
                        <p>Active Students</p>
                    </div>
                </div>

                <div className="stat-item">
                    <div className="stat-icon sessions">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{courses.reduce((total, course) => total + course.completedSessions, 0)}</h3>
                        <p>Completed Sessions</p>
                    </div>
                </div>

                <div className="stat-item">
                    <div className="stat-icon upcoming">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{courses.length}</h3>
                        <p>Upcoming Sessions</p>
                    </div>
                </div>
            </div>

            <div className="course-list">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-header">
                                <BookOpen size={24} />
                                <div>
                                    <h3>{course.title}</h3>
                                    <span className="course-category">{course.category}</span>
                                </div>
                            </div>

                            <div className="course-details">
                                <div className="detail-item">
                                    <strong>Student:</strong>
                                    <span>{course.student} ({course.studentId})</span>
                                </div>

                                <div className="detail-item">
                                    <strong>Enrolled On:</strong>
                                    <span>{formatDate(course.enrollmentDate)}</span>
                                </div>

                                <div className="detail-item">
                                    <strong>Next Session:</strong>
                                    <span>{formatDate(course.nextSession)} at {formatTime(course.nextSession)}</span>
                                </div>

                                <div className="detail-item">
                                    <strong>Sessions:</strong>
                                    <span>{course.completedSessions} of {course.totalSessions} completed</span>
                                </div>
                            </div>

                            <div className="course-progress">
                                <div className="progress-info">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="course-actions">
                                <button className="view-details-btn">View Details</button>
                                <button className="schedule-btn">Schedule Session</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-courses-message">
                        <BookOpen size={40} />
                        <h3>No courses found</h3>
                        {searchTerm ? (
                            <p>No courses match your search criteria. Try different keywords.</p>
                        ) : (
                            <p>You don't have any ongoing courses at the moment.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OngoingCourse; 