import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Calendar, BookOpen, MessageCircle, Users, CreditCard, Settings, Clock } from "lucide-react";
import "./MentorDashboard.css";
import MentorScheduling from "./MentorScheduling";
import Courses from "./Courses";
import CourseScheduling from "./CourseScheduling";
import Invitation from "./Invitation";
import MentorStudents from "./MentorStudents";
import UpcomingSession from "./UpcomingSession";
import ScheduleSession from "./ScheduleSession";
import defaultProfile from "../../assets/default-profile.jpeg";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, experience, certifications, role, specialization, university, linkedin } = location.state || {};

  const [activeTab, setActiveTab] = useState("upcoming");

  const handleLogout = () => {
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "upcoming":
        return <UpcomingSession />;
      case "scheduling":
        return <MentorScheduling />;
      case "schedule-session":
        return <ScheduleSession />;
      case "courses":
        return <Courses />;
      case "course-scheduling":
        return <CourseScheduling />;
      case "students":
        return <MentorStudents />; 
      default:
        return <UpcomingSession />;
    }
  };

  return (
    <div className="mentor-dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h2>Mentor Dashboard</h2>
        </div>
        <div className="header-actions">
          <Invitation />  
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="settings-icon" onClick={() => navigate("/setting")}>
            <Settings size={24} />
          </div>

          <div className="profile-section">
            <img src={defaultProfile} alt="Profile" className="profile-pic" />
            <h3>{name}</h3>
            <p>{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Mentor'}</p>
          </div>

          <nav className="dashboard-nav-links">
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              <Calendar size={20} /> Upcoming Sessions
            </button>

            <button
              className={activeTab === "schedule-session" ? "active" : ""}
              onClick={() => setActiveTab("schedule-session")}
            >
              <Clock size={20} /> Schedule Session
            </button>

            <button
              className={activeTab === "students" ? "active" : ""}
              onClick={() => setActiveTab("students")}
            >
              <MessageCircle size={20} /> Students
            </button>

            <button
              className={activeTab === "courses" ? "active" : ""}
              onClick={() => setActiveTab("courses")}
            >
              <BookOpen size={20} /> Courses    
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </aside>

        <main className="dashboard-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;
