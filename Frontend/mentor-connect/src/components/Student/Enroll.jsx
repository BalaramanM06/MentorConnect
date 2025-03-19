import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Enroll.css";
import { CheckCircle, Clock, Book, Award, Users, Calendar, Tag, BookOpen } from "lucide-react";

const Enroll = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { course } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!agreeToTerms) {
            alert("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);

        // Simulate enrollment process
        setTimeout(() => {
            // Add course to enrolled courses (In a real app, this would be an API call)
            const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

            // Add the course with the same structure as in FindCourses
            const newEnrolledCourse = {
                ...course,
                enrollmentDate: new Date().toISOString(),
                status: "Ongoing",
                progress: 0
            };

            // Check if course is already enrolled
            const alreadyEnrolled = enrolledCourses.some(c => c.id === course.id);

            if (!alreadyEnrolled) {
                enrolledCourses.push(newEnrolledCourse);
                localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
            }

            setLoading(false);

            navigate("/course-tracker", {
                state: {
                    message: "Enrollment successful! Your course is now in your tracker.",
                    newCourse: newEnrolledCourse
                }
            });
        }, 1500);
    };

    if (!course) {
        return <div className="enroll-container">Course information not found. Please go back and try again.</div>;
    }

    return (
        <div className="enroll-container">
            <div className="enroll-card">
                <h2><BookOpen size={28} className="title-icon" /> Enroll in Course</h2>

                <div className="enrollment-summary">
                    <div className="course-table-container">
                        <table className="course-details-table">
                            <thead>
                                <tr>
                                    <th colSpan="2">Course Information</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="detail-label">
                                        <Book size={18} /> Title
                                    </td>
                                    <td className="detail-value">{course.title}</td>
                                </tr>
                                <tr>
                                    <td className="detail-label">
                                        <Users size={18} /> Instructor
                                    </td>
                                    <td className="detail-value">{course.instructor}</td>
                                </tr>
                                {course.category && (
                                    <tr>
                                        <td className="detail-label">
                                            <Tag size={18} /> Category
                                        </td>
                                        <td className="detail-value">
                                            <span className="course-category">{course.category}</span>
                                            {course.level && <span className="course-level">{course.level}</span>}
                                        </td>
                                    </tr>
                                )}
                                {course.duration && (
                                    <tr>
                                        <td className="detail-label">
                                            <Clock size={18} /> Duration
                                        </td>
                                        <td className="detail-value">{course.duration}</td>
                                    </tr>
                                )}
                                {course.startDate && (
                                    <tr>
                                        <td className="detail-label">
                                            <Calendar size={18} /> Start Date
                                        </td>
                                        <td className="detail-value">
                                            {new Date(course.startDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </td>
                                    </tr>
                                )}
                                {course.certification && (
                                    <tr>
                                        <td className="detail-label">
                                            <Award size={18} /> Certification
                                        </td>
                                        <td className="detail-value">
                                            <span className="certification-badge">
                                                <CheckCircle size={14} /> Included
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {course.description && (
                        <div className="course-description">
                            <h3>Course Description</h3>
                            <p>{course.description}</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="enrollment-form">
                    <div className="form-section">
                        <h3>Confirm Enrollment</h3>
                        <p className="enrollment-message">
                            You are about to enroll in <strong>{course.title}</strong>. This course will be added to your learning journey.
                        </p>
                        <label className="terms-checkbox">
                            <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                required
                            />
                            <h5>I agree to the terms and conditions</h5>
                        </label>
                    </div>

                    <div className="actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/find-courses")}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="enroll-btn"
                            disabled={loading || !agreeToTerms}
                        >
                            {loading ? "Processing..." : "Confirm Enrollment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Enroll; 