import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Check } from "lucide-react";
import "./StudentScheduling.css";

const StudentScheduling = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mentor: preSelectedMentor } = location.state || {};

    const [step, setStep] = useState(preSelectedMentor ? "schedule" : "select-mentor");
    const [selectedMentor, setSelectedMentor] = useState(preSelectedMentor || null);
    const [mentors, setMentors] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [weekDays, setWeekDays] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Time slots from 6AM to 10PM with 2-hour intervals
    const timeSlots = [
        "06:00 - 08:00", "08:00 - 10:00", "10:00 - 12:00",
        "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00",
        "18:00 - 20:00", "20:00 - 22:00"
    ];

    // Load mentors with their courses
    useEffect(() => {
        // Simplified mentor data - just name and main course
        const mentorsData = [
            {
                id: 1,
                name: "Dr. Emily Carter",
                course: "Data Science with Python"
            },
            {
                id: 2,
                name: "Prof. John Smith",
                course: "Cybersecurity Fundamentals"
            },
            {
                id: 3,
                name: "Dr. Susan Lee",
                course: "Artificial Intelligence"
            },
            {
                id: 4,
                name: "Dr. Mark Johnson",
                course: "Cloud Systems Architecture"
            }
        ];

        setMentors(mentorsData);
    }, []);

    // Generate next 7 days starting from today
    useEffect(() => {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            days.push({
                date,
                dateString: date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                })
            });
        }

        setWeekDays(days);
    }, []);

    const handleMentorSelect = (mentor) => {
        setSelectedMentor(mentor);
        setStep("schedule");
    };

    const handleGoBack = () => {
        if (step === "schedule") {
            setStep("select-mentor");
            setSelectedMentor(null);
        } else {
            navigate(-1);
        }
    };

    const handleSlotClick = (day, timeSlot) => {
        const slotKey = `${day.dateString}-${timeSlot}`;

        if (selectedSlots.includes(slotKey)) {
            setSelectedSlots(selectedSlots.filter(slot => slot !== slotKey));
        } else {
            setSelectedSlots([...selectedSlots, slotKey]);
        }
    };

    const handleSubmit = () => {
        if (selectedSlots.length === 0) {
            alert("Please select at least one time slot");
            return;
        }

        setIsSubmitting(true);

        // In a real application, this would be an API call to save the selected slots
        setTimeout(() => {
            // Create notifications for the mentor
            const mentorNotifications = JSON.parse(localStorage.getItem("mentorNotifications") || "[]");

            selectedSlots.forEach(slot => {
                const [dateStr, timeStr] = slot.split("-");

                mentorNotifications.push({
                    id: Date.now() + Math.random(),
                    type: "scheduling",
                    message: `A student has requested a session on ${dateStr} at ${timeStr.trim()}`,
                    time: "Just now",
                    read: false,
                    studentName: localStorage.getItem("studentName") || "Student",
                    status: "pending",
                    mentorId: selectedMentor.id
                });
            });

            localStorage.setItem("mentorNotifications", JSON.stringify(mentorNotifications));

            // Update student's notifications about the request
            const studentNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
            studentNotifications.push({
                id: Date.now(),
                type: "session",
                message: `Your scheduling request has been sent to ${selectedMentor.name} for approval`,
                time: "Just now",
                read: false
            });

            localStorage.setItem("notifications", JSON.stringify(studentNotifications));

            setIsSubmitting(false);
            setSubmitSuccess(true);

            // Redirect back to dashboard after showing success message
            setTimeout(() => {
                navigate("/student-dashboard");
            }, 2000);
        }, 1500);
    };

    return (
        <div className="scheduling-container">
            <div className="scheduling-header">
                <button className="back-button" onClick={handleGoBack}>
                    <ArrowLeft size={20} />
                </button>
                <h1>
                    <Calendar size={24} />
                    {step === "select-mentor" ? "Choose a Mentor" : "Schedule a Session"}
                </h1>
            </div>

            {submitSuccess ? (
                <div className="success-message">
                    <Check size={50} className="success-icon" />
                    <h2>Scheduling Request Sent!</h2>
                    <p>Your request has been sent to {selectedMentor.name} for confirmation.</p>
                </div>
            ) : step === "select-mentor" ? (
                <>
                    <div className="mentor-selection-info">
                        <p>Select a mentor to schedule a session with:</p>
                    </div>

                    <div className="mentor-simple-list">
                        {mentors.map(mentor => (
                            <div
                                key={mentor.id}
                                className="mentor-simple-card"
                                onClick={() => handleMentorSelect(mentor)}
                            >
                                <h3>{mentor.name}</h3>
                                <p>{mentor.course}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="scheduling-info">
                        <div className="simple-mentor-info">
                            <h3>{selectedMentor.name}</h3>
                            <p>{selectedMentor.course}</p>
                        </div>
                        <p className="scheduling-instruction">
                            Select your preferred time slots for the session.
                        </p>
                    </div>

                    <div className="calendar-container">
                        <div className="time-header">
                            <div className="time-slot-label">Time Slots</div>
                            {weekDays.map((day, index) => (
                                <div key={index} className="day-header">
                                    <div className="day-name">{day.dateString.split(",")[0]}</div>
                                    <div className="day-date">{day.dateString.split(",")[1]}</div>
                                </div>
                            ))}
                        </div>

                        <div className="time-slots">
                            {timeSlots.map((timeSlot, timeIndex) => (
                                <div key={timeIndex} className="time-row">
                                    <div className="time-slot-label">
                                        <Clock size={14} />
                                        <span>{timeSlot}</span>
                                    </div>

                                    {weekDays.map((day, dayIndex) => {
                                        const slotKey = `${day.dateString}-${timeSlot}`;
                                        const isSelected = selectedSlots.includes(slotKey);

                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`time-cell ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleSlotClick(day, timeSlot)}
                                            >
                                                {isSelected && <Check size={16} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="scheduling-actions">
                        <button
                            className="submit-button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || selectedSlots.length === 0}
                        >
                            {isSubmitting ? "Sending request..." : "Submit Schedule Request"}
                        </button>
                        <p className="slots-selected">
                            {selectedSlots.length} time slot{selectedSlots.length !== 1 ? "s" : ""} selected
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentScheduling; 