import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Calendar, BookOpen, MessageCircle, Settings, Clock, Users } from "lucide-react";
import "./MentorDashboard.css";
import Courses from "./Courses";
import Invitation from "./Invitation";
import MentorStudents from "./MentorStudents";
import UpcomingSession from "./UpcomingSession";
import ScheduleSession from "./ScheduleSession";
import defaultProfile from "../../assets/default-profile.jpeg";
import api from "../../utils/axiosConfig";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [userProfile, setUserProfile] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorDetails();
}, []);

const fetchMentorDetails = async () => {
    setError(null);
    const token = localStorage.getItem("authToken");

    if (!token) {
        setError("Authentication token missing. Please log in.");
        setLoading(false);
        navigate("/login");
        return;
    }

    try {
        const response = await api.get("/auth/profile");
        if (response.data?.email) {
            setUserProfile(response.data);
            console.log(response.data);
        } else {
            setError("Failed to fetch mentor details.");
        }
    } catch (err) {
        console.error("Error fetching mentor details:", err);
        setError("Failed to fetch mentor details.");
    } finally {
        setLoading(false);  
    }
};

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "upcoming":
        return <UpcomingSession />;
      case "schedule-session":
        return <ScheduleSession />;
      case "courses":
        return <Courses />;
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
            <Settings size={22} />
          </div>

          <div className="profile-section">
            <img src={userProfile?.profilePic || defaultProfile} alt="Profile" className="profile-pic" />
            <h3>{userProfile?.firstName|| "Mentor Name"}</h3>
          </div>

          <nav className="dashboard-nav-links">
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              <Calendar size={20} /> <span>Upcoming Sessions</span>
            </button>

            <button
              className={activeTab === "schedule-session" ? "active" : ""}
              onClick={() => setActiveTab("schedule-session")}
            >
              <Clock size={20} /> <span>Schedule Session</span>
            </button>

            <button
              className={activeTab === "students" ? "active" : ""}
              onClick={() => setActiveTab("students")}
            >
              <Users size={20} /> <span>Students</span>
              {unreadMessages.length > 0 && (
                <span className="badge">{unreadMessages.length}</span>
              )}
            </button>

            <button
              className={activeTab === "courses" ? "active" : ""}
              onClick={() => setActiveTab("courses")}
            >
              <BookOpen size={20} /> <span>Courses</span>
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </aside>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                {activeTab === "upcoming" && "Upcoming Sessions"}
                {activeTab === "schedule-session" && "Schedule a Session"}
                {activeTab === "students" && "My Students"}
                {activeTab === "courses" && "Courses"}
              </h2>
            </div>
            <div className="card-content">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
