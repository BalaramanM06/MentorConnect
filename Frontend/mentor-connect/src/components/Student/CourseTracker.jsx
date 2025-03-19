import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseTracker.css";
import { CheckCircle, Clock, Filter, Download, ExternalLink, BookOpen } from "lucide-react";
import certificateTemplate from "../../assets/certificateTemplate.png";
import StudentNotification from "./StudentNotification";

const CourseTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    setEnrolledCourses(storedCourses);

    if (location.state?.message) {
      setNotification(location.state.message);
      setTimeout(() => {
        setNotification("");
      }, 5000);
    }
  }, [location.state]);

  const filteredCourses = filter === "All"
    ? enrolledCourses
    : enrolledCourses.filter(course => course.status === filter);

  const downloadCertificate = (course) => {
    const link = document.createElement('a');
    link.href = certificateTemplate;
    link.download = `${course.title.replace(/\s+/g, '_')}_Certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContinue = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="course-tracker-container">
      <StudentNotification />
      <h2><BookOpen size={28} className="title-icon" /> My Learning Journey</h2>

      {notification && (
        <div className="notification-bar">
          {notification}
        </div>
      )}

      {/* Filter Options */}
      <div className="filter-section">
        <Filter size={20} />
        <div className="filter-buttons">
          <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All Courses</button>
          <button className={filter === "Ongoing" ? "active" : ""} onClick={() => setFilter("Ongoing")}>In Progress</button>
          <button className={filter === "Completed" ? "active" : ""} onClick={() => setFilter("Completed")}>Completed</button>
        </div>
      </div>

      {/* Course Table */}
      {filteredCourses.length > 0 ? (
        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th className="course-title-header">Course Information</th>
                <th>Instructor</th>
                <th>Enrollment Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className={course.status.toLowerCase()}>
                  <td className="course-info-cell">
                    <div className="course-title">{course.title}</div>
                    <div className="course-categories">
                      {course.category && <span className="course-category">{course.category}</span>}
                      {course.level && <span className="course-level">{course.level}</span>}
                    </div>
                  </td>
                  <td className="instructor-cell">{course.instructor}</td>
                  <td className="date-cell">
                    {course.enrollmentDate
                      ? new Date(course.enrollmentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })
                      : "N/A"}
                  </td>
                  <td className={`status ${course.status.toLowerCase()}`}>
                    {course.status === "Completed" ? (
                      <span className="status-icon"><CheckCircle size={16} /> Completed</span>
                    ) : (
                      <span className="status-icon"><Clock size={16} /> In Progress</span>
                    )}
                    {course.progress && (
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                        <span className="progress-text">{course.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="course-actions-cell">
                    {course.status === "Ongoing" && (
                      <button
                        className="continue-btn"
                        onClick={() => handleContinue(course.id)}
                        title="Continue Learning"
                      >
                        <ExternalLink size={16} /> Continue
                      </button>
                    )}
                    {course.status === "Completed" && (
                      <button
                        className="certificate-btn"
                        onClick={() => downloadCertificate(course)}
                        title="Download Certificate"
                      >
                        <Download size={16} /> Certificate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't enrolled in any courses yet.</p>
          <button className="find-courses-btn" onClick={() => navigate("/find-courses")}>
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseTracker;
