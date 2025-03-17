import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BookOpen, MessageCircle, Users, CreditCard, FileText, Settings } from "lucide-react";
import "./StudentDashboard.css";
import defaultProfile from "../../assets/default-profile.jpeg";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role, degree, specialization, university, linkedin, profilePhoto } = location.state || {};

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="settings-icon" onClick={() => navigate("/student-settings")}>
          <Settings size={24} />
        </div>

        <div className="profile-section">
          <img src={profilePhoto || defaultProfile} alt="Profile" className="profile-pic" />
          <h3>{name}</h3>
          <p>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>

        <nav className="nav-links">
          <button onClick={() => navigate("/student-courses")}>
            <BookOpen size={20} /> My Courses
          </button>
          <button onClick={() => navigate("/finding-mentor")}>
            <Users size={20} /> Find Mentors
          </button>
          <button onClick={() => navigate("/messages")}>
            <MessageCircle size={20} /> Messages
          </button>
          <button onClick={() => navigate("/payment")}>
            <CreditCard size={20} /> Payments
          </button>
          <button onClick={() => navigate("/course-tracker")}>
            <FileText size={20} /> Course Tracker
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, {name}!</h1>
        <p>Your current education details:</p>
        <ul>
          <li><strong>Degree:</strong> {degree}</li>
          <li><strong>Specialization:</strong> {specialization}</li>
          <li><strong>University:</strong> {university}</li>
          {linkedin && (
            <li>
              <strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer">View Profile</a>  
            </li>
          )}
        </ul>
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
