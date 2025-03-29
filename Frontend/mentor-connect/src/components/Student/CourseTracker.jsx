import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CourseTracker.css";
import { CheckCircle, Clock, Filter, Download, ExternalLink, BookOpen } from "lucide-react";
import certificateTemplate from "../../assets/certificateTemplate.png";
import StudentNotification from "./StudentNotification";
import api from "../../utils/axiosConfig";

const CourseTracker = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentCourse, setCurrentCourse] = useState([]);
  const [pastCourse, setPastCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const enrolledResponse = await api.get("/mentee/getNewCourse");
        const completedResponse = await api.get("/mentee/getOldCourse");
        if (enrolledResponse.data) {
          const formattedCourses = enrolledResponse.data.map(data => ({
            courseName: data.course.courseName,
            courseId: data.course.id,
            level: "Intermediate",
            status: "Ongoing",
            enrollmentDate: data.course.enrollmentDate,
            category: data.course.category,
            mentor: `${data.user.firstName} ${data.user.lastName ? data.user.lastName : ""}`,
          }));
          setCurrentCourse(formattedCourses); 
          console.log(formattedCourses);
        }
        if (completedResponse.data) {
          const formattedCourses = completedResponse.data.map(data => ({
            courseName: data.course.courseName,
            courseId: data.course.id,
            level: "Intermediate",
            status: "Completed",
            completionDate: data.course.completionDate,
            category: data.course.category,
            mentor: `${data.user.firstName} ${data.user.lastName ? data.user.lastName : ""}`,
          }));
          setPastCourse(formattedCourses); 
          console.log(formattedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = filter === "All"
    ? enrolledCourses
    : enrolledCourses.filter(course => course.status === filter);

  const downloadCertificate = (course) => {
    const link = document.createElement('a');
    link.href = certificateTemplate;
    link.download = `${course.title.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContinue = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="course-tracker-container">
      <div className="course-tracker-header">
        <h2><BookOpen size={28} className="book-open-title-icon" /> My Learning Journey</h2>
      </div>

      <div className="filter-section">
        <Filter size={20} />
        <div className="filter-buttons">
          <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All Courses</button>
          <button className={filter === "Ongoing" ? "active" : ""} onClick={() => setFilter("Ongoing")}>In Progress</button>
          <button className={filter === "Completed" ? "active" : ""} onClick={() => setFilter("Completed")}>Completed</button>
        </div>
      </div>

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
