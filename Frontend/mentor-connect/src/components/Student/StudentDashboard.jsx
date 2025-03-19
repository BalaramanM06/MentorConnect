import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BookOpen, MessageCircle, Users, CreditCard, FileText, Settings, BookOpenCheck } from "lucide-react";
import "./StudentDashboard.css";
import defaultProfile from "../../assets/default-profile.jpeg";
import StudentNotification from "./StudentNotification";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role, degree, specialization, university, linkedin } = location.state || {};

  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Load enrolled courses from local storage
    const storedCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    // Filter only ongoing courses
    const ongoingCourses = storedCourses.filter(course => course.status === "Ongoing");
    setEnrolledCourses(ongoingCourses);
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleContinue = (courseId) => {
    console.log(`Continuing course with ID: ${courseId}`);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="student-dashboard-container">
      <StudentNotification />

      <aside className="sidebar">
        <div className="settings-icon" onClick={() => navigate("/setting")}>
          <Settings size={24} />
        </div>

        <div className="profile-section">
          <img src={defaultProfile} alt="Profile" className="profile-pic" />
          <h3>{name}</h3>
          <p>{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Role not defined'}</p>
        </div>

        <nav className="student-dashboard-nav-links">
          {[
            { icon: <BookOpen size={20} />, label: "Find Courses", path: "/find-courses" },
            { icon: <Users size={20} />, label: "Find Mentors", path: "/finding-mentor" },
            { icon: <MessageCircle size={20} />, label: "Messages", path: "/messages" },
            { icon: <BookOpenCheck size={20} />, label: "Resources", path: "/resources" },
            { icon: <CreditCard size={20} />, label: "Payments", path: "/payment" },
            { icon: <FileText size={20} />, label: "Course Tracker", path: "/course-tracker" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, {name}!</h1>

        <div className="ongoing-courses">
          <h3>Your Ongoing Courses</h3>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div key={course.id} className="course-card">
                <h4>{course.title}</h4>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <div className="course-progress">
                  <div className="progress-label">
                    <span>Progress: {course.progress || 0}%</span>
                    <span>{course.progress ? `${Math.floor(course.progress / 10)}/${course.duration?.split(' ')[0] || 10}` : '0/10'} modules</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="course-tags">
                  {course.category && <span className="course-category">{course.category}</span>}
                  {course.level && <span className="course-level">{course.level}</span>}
                </div>
                <p><strong>Enrolled on:</strong> {course.enrollmentDate ? new Date(course.enrollmentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) : 'N/A'}</p>
                <div className="course-actions">
                  <button onClick={() => handleContinue(course.id)}>Continue Learning</button>
                  <button className="resources-btn" onClick={() => navigate("/resources")}>Resources</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-courses">You haven't enrolled in any courses yet. <button onClick={() => navigate('/find-courses')}>Find Courses</button></p>
          )}
        </div>

        <div className="upcoming-sessions">
          <h3>Upcoming Sessions</h3>
          <p>You have no upcoming sessions.</p>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <p>No recent activity to display.</p>
        </div>
      </main>

      <div className="floating-calendar">
        <button
          className="calendar-button"
          onClick={() => navigate("/scheduling")}
          title="Schedule a session"
        >
          <Calendar size={40} />
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
