import React, { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    Search,
    BookOpen,
    User,
    Plus,
    ChevronDown,
    Globe,
    Check,
    X,
    Users
} from "lucide-react";
import "./ScheduleSession.css";

const ScheduleSession = () => {
    // State variables
    const [ongoingCourses, setOngoingCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [timezone, setTimezone] = useState('');
    const [sessionDuration, setSessionDuration] = useState(60); // default 60 minutes

    // New state variables for student selection
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

    // Fetch ongoing courses from localStorage or create demo data if none exists
    useEffect(() => {
        const storedCourses = JSON.parse(localStorage.getItem("mentorOngoingCourses") || "[]");

        if (storedCourses.length === 0) {
            // Create sample courses if none exist
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
                    enrollmentDate: "2023-05-01",
                    enrolledStudents: [
                        { id: "STU12345", name: "Alex Johnson", email: "alex@example.com" },
                        { id: "STU67890", name: "Sarah Miller", email: "sarah@example.com" },
                        { id: "STU13579", name: "James Wilson", email: "james@example.com" }
                    ]
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
                    enrollmentDate: "2023-05-15",
                    enrolledStudents: [
                        { id: "STU67890", name: "Emily Chen", email: "emily@example.com" },
                        { id: "STU24680", name: "Michael Smith", email: "michael@example.com" },
                        { id: "STU35791", name: "Sophia Garcia", email: "sophia@example.com" }
                    ]
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
                    enrollmentDate: "2023-04-20",
                    enrolledStudents: [
                        { id: "STU24680", name: "Michael Smith", email: "michael@example.com" },
                        { id: "STU46802", name: "David Zhang", email: "david@example.com" }
                    ]
                }
            ];

            setOngoingCourses(sampleCourses);
        } else {
            // If each course doesn't have enrolledStudents, add some mock data
            const coursesWithStudents = storedCourses.map(course => {
                if (!course.enrolledStudents) {
                    return {
                        ...course,
                        enrolledStudents: [
                            { id: course.studentId, name: course.student }
                        ]
                    };
                }
                return course;
            });

            setOngoingCourses(coursesWithStudents);
        }

        // Get user's timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(userTimezone);

        // Generate available dates (today + next 7 days)
        generateAvailableDates();

        // Generate time slots
        generateTimeSlots();
    }, []);

    // Filter courses based on search term
    const filteredCourses = ongoingCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter enrolled students based on search term
    const filteredStudents = enrolledStudents.filter(student =>
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        (student.email && student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()))
    );

    // Generate available dates (today + next 7 days)
    const generateAvailableDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 8; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        setAvailableDates(dates);
        // Set today as the default selected date
        setSelectedDate(dates[0]);
    };

    // Generate time slots from 8 AM to 8 PM in 30-minute intervals
    const generateTimeSlots = () => {
        const slots = [];

        for (let hour = 8; hour < 21; hour++) {
            for (let minute of [0, 30]) {
                if (hour === 20 && minute === 30) continue; // Skip 8:30 PM

                const formattedHour = hour % 12 || 12;
                const period = hour >= 12 ? 'PM' : 'AM';
                const formattedMinute = minute === 0 ? '00' : minute;

                slots.push({
                    value: `${hour}:${formattedMinute}`,
                    label: `${formattedHour}:${formattedMinute} ${period}`,
                    selected: false
                });
            }
        }

        setTimeSlots(slots);
    };

    // Handle course selection
    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setCourseDropdownOpen(false);

        // Reset student selection when course changes
        setSelectedStudent(null);

        // Update enrolled students list
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            setEnrolledStudents(course.enrolledStudents);
        } else {
            // Fallback if no enrolled students data
            setEnrolledStudents([{ id: course.studentId, name: course.student }]);
        }
    };

    // Handle student selection
    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setStudentDropdownOpen(false);
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setDateDropdownOpen(false);
    };

    // Toggle time slot selection
    const toggleTimeSlot = (index) => {
        const updatedTimeSlots = [...timeSlots];
        updatedTimeSlots[index].selected = !updatedTimeSlots[index].selected;
        setTimeSlots(updatedTimeSlots);

        // Update selected time slots
        const selected = updatedTimeSlots.filter(slot => slot.selected);
        setSelectedTimeSlots(selected);
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Check if a given date is today
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Schedule the sessions
    const handleSchedule = () => {
        if (!selectedCourse || !selectedDate || selectedTimeSlots.length === 0 || !selectedStudent) {
            alert("Please select a course, student, date, and at least one time slot");
            return;
        }

        // Create schedule entries
        const schedules = selectedTimeSlots.map((slot, index) => {
            const [hours, minutes] = slot.value.split(':').map(Number);
            const scheduleDate = new Date(selectedDate);

            return {
                id: `schedule-${Date.now()}-${index}`,
                course: selectedCourse.title,
                student: selectedStudent.name,
                studentId: selectedStudent.id,
                date: scheduleDate.toISOString().split('T')[0],
                time: slot.value,
                duration: sessionDuration,
                timezone: timezone,
                status: "pending", // pending confirmation from student
                createdAt: new Date().toISOString()
            };
        });

        // Save to localStorage
        const existingSchedules = JSON.parse(localStorage.getItem("mentorSchedules") || "[]");
        const updatedSchedules = [...existingSchedules, ...schedules];
        localStorage.setItem("mentorSchedules", JSON.stringify(updatedSchedules));

        // Show confirmation
        setShowConfirmation(true);

        // Reset selections after 3 seconds
        setTimeout(() => {
            setShowConfirmation(false);
            setSelectedTimeSlots([]);
            setTimeSlots(timeSlots.map(slot => ({ ...slot, selected: false })));
        }, 3000);
    };

    // Handle duration change
    const handleDurationChange = (e) => {
        setSessionDuration(Number(e.target.value));
    };

    return (
        <div className="schedule-session-container">
            <h2>Schedule Sessions</h2>
            <p className="subtitle">Select time slots for students to confirm</p>

            {showConfirmation && (
                <div className="confirmation-message">
                    <Check size={20} />
                    <span>Sessions scheduled successfully! Students will be notified to confirm.</span>
                </div>
            )}

            <div className="schedule-form">
                {/* Course Selection */}
                <div className="form-group">
                    <label>Select Course</label>
                    <div className="dropdown-container">
                        <div
                            className="dropdown-header"
                            onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                        >
                            <div className="selected-option">
                                {selectedCourse ? (
                                    <div className="selected-course">
                                        <BookOpen size={18} />
                                        <div className="course-info">
                                            <div className="course-title">{selectedCourse.title}</div>
                                            <div className="course-category">{selectedCourse.category}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="placeholder">Choose a course...</span>
                                )}
                            </div>
                            <ChevronDown size={18} />
                        </div>

                        {courseDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-search">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search courses..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="dropdown-options">
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map(course => (
                                            <div
                                                key={course.id}
                                                className="dropdown-option"
                                                onClick={() => handleCourseSelect(course)}
                                            >
                                                <BookOpen size={18} />
                                                <div className="option-details">
                                                    <div className="option-title">{course.title}</div>
                                                    <div className="option-subtitle">
                                                        <span className="category-tag">{course.category}</span>
                                                        <Users size={14} />
                                                        <span>{course.enrolledStudents?.length || 1} students</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-options">No courses found</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Selection - Show only when course is selected */}
                {selectedCourse && (
                    <div className="form-group">
                        <label>Select Student</label>
                        <div className="dropdown-container">
                            <div
                                className="dropdown-header"
                                onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                            >
                                <div className="selected-option">
                                    {selectedStudent ? (
                                        <div className="selected-student">
                                            <User size={18} />
                                            <div className="student-info">
                                                <div className="student-name">{selectedStudent.name}</div>
                                                <div className="student-id">{selectedStudent.id}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="placeholder">Choose a student...</span>
                                    )}
                                </div>
                                <ChevronDown size={18} />
                            </div>

                            {studentDropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-search">
                                        <Search size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search students..."
                                            value={studentSearchTerm}
                                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="dropdown-options">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map(student => (
                                                <div
                                                    key={student.id}
                                                    className="dropdown-option"
                                                    onClick={() => handleStudentSelect(student)}
                                                >
                                                    <User size={18} />
                                                    <div className="option-details">
                                                        <div className="option-title">{student.name}</div>
                                                        <div className="option-subtitle">
                                                            <span>{student.id}</span>
                                                            {student.email && (
                                                                <span className="student-email">{student.email}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-options">No students found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Date Selection */}
                <div className="form-group">
                    <label>Select Date</label>
                    <div className="dropdown-container">
                        <div
                            className="dropdown-header"
                            onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                        >
                            <div className="selected-option">
                                {selectedDate ? (
                                    <div className="selected-date">
                                        <Calendar size={18} />
                                        <span>
                                            {formatDate(selectedDate)}
                                            {isToday(selectedDate) && <span className="today-badge">Today</span>}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="placeholder">Choose a date...</span>
                                )}
                            </div>
                            <ChevronDown size={18} />
                        </div>

                        {dateDropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-options date-options">
                                    {availableDates.map((date, index) => (
                                        <div
                                            key={index}
                                            className={`dropdown-option date-option ${isToday(date) ? 'today' : ''}`}
                                            onClick={() => handleDateSelect(date)}
                                        >
                                            <Calendar size={18} />
                                            <span>{formatDate(date)}</span>
                                            {isToday(date) && <span className="today-badge">Today</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Session Duration */}
                <div className="form-group">
                    <label>Session Duration</label>
                    <div className="duration-selector">
                        <select value={sessionDuration} onChange={handleDurationChange}>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>
                </div>

                {/* Timezone */}
                <div className="form-group">
                    <label>Timezone</label>
                    <div className="timezone-display">
                        <Globe size={18} />
                        <span>{timezone}</span>
                    </div>
                    <p className="timezone-note">Students will see these slots in their local timezone</p>
                </div>
            </div>

            {/* Time Slots Selection */}
            <div className="time-slots-section">
                <h3>Select Available Time Slots</h3>
                <p className="time-slots-subtitle">Students will confirm their preferred time from your selection</p>

                <div className="time-slots-grid">
                    {timeSlots.map((slot, index) => (
                        <div
                            key={index}
                            className={`time-slot ${slot.selected ? 'selected' : ''}`}
                            onClick={() => toggleTimeSlot(index)}
                        >
                            <Clock size={14} />
                            <span>{slot.label}</span>
                            {slot.selected && <Check size={14} className="check-icon" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Selected Time Slots Summary */}
            {selectedTimeSlots.length > 0 && (
                <div className="selected-slots-summary">
                    <h3>Selected Time Slots</h3>
                    <div className="selected-slots-list">
                        {selectedTimeSlots.map((slot, index) => (
                            <div key={index} className="selected-slot-item">
                                <Clock size={16} />
                                <span>{slot.label}</span>
                                <X
                                    size={16}
                                    className="remove-slot"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleTimeSlot(timeSlots.findIndex(s => s.value === slot.value));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Session Summary */}
            {selectedCourse && selectedStudent && selectedDate && selectedTimeSlots.length > 0 && (
                <div className="session-summary">
                    <h3>Session Summary</h3>
                    <div className="summary-details">
                        <div className="summary-item">
                            <BookOpen size={16} />
                            <span><strong>Course:</strong> {selectedCourse.title}</span>
                        </div>
                        <div className="summary-item">
                            <User size={16} />
                            <span><strong>Student:</strong> {selectedStudent.name}</span>
                        </div>
                        <div className="summary-item">
                            <Calendar size={16} />
                            <span><strong>Date:</strong> {formatDate(selectedDate)}</span>
                        </div>
                        <div className="summary-item">
                            <Clock size={16} />
                            <span><strong>Slots:</strong> {selectedTimeSlots.length} selected</span>
                        </div>
                        <div className="summary-item">
                            <Globe size={16} />
                            <span><strong>Duration:</strong> {sessionDuration} minutes each</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div className="schedule-actions">
                <button
                    className="schedule-button"
                    onClick={handleSchedule}
                    disabled={!selectedCourse || !selectedStudent || !selectedDate || selectedTimeSlots.length === 0}
                >
                    <Plus size={18} />
                    Schedule Sessions
                </button>
            </div>
        </div>
    );
};

export default ScheduleSession; 