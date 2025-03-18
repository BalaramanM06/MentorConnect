import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BookOpen, MessageCircle, Users, CreditCard, FileText, Settings } from "lucide-react";
import "./StudentDashboard.css";
import defaultProfile from "../../assets/default-profile.jpeg";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role, degree, specialization, university, linkedin } = location.state || {};

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to AI",
      mentor: "Dr. John Doe",
      progress: 65,
      nextClass: "Wed, Jun 15, 2:00 PM",
      completed: "7/12 modules"
    },
    {
      id: 2,
      title: "Advanced React",
      mentor: "Jane Smith",
      progress: 30,
      nextClass: "Fri, Jun 17, 3:30 PM",
      completed: "3/10 modules"
    }
  ]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleContinue = (courseId) => {
    console.log(`Continuing course with ID: ${courseId}`);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="student-dashboard-container">
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
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="course-card">
                <h4>{course.title}</h4>
                <p><strong>Mentor:</strong> {course.mentor}</p>
                <div className="course-progress">
                  <div className="progress-label">
                    <span>Progress: {course.progress}%</span>
                    <span>{course.completed}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p><strong>Next Class:</strong> {course.nextClass}</p>
                <div className="course-actions">
                  <button onClick={() => handleContinue(course.id)}>Continue Learning</button>
                  <button className="resources-btn">Resources</button>
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
        <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">
          <Calendar size={40} />
        </a>
      </div>
    </div>
  );
};

export default StudentDashboard;
