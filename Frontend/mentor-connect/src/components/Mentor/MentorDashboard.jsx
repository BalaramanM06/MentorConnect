import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, Calendar, BookOpen, MessageCircle, Settings, Clock } from "lucide-react";
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
  const location = useLocation();
  const { name, experience, certifications, role, specialization, university, linkedin } = location.state || {};

  const [activeTab, setActiveTab] = useState("upcoming");
  const [userProfile, setUserProfile] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState([]);

  // Example of fetching user profile data with authenticated request
  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token
      navigate('/login');
      return;
    }

    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        // Get user profile
        const profileResponse = await api.get('/api/profile');
        if (profileResponse.data) {
          setUserProfile(profileResponse.data);
        }

        // Get unread messages
        const messagesResponse = await api.get('/api/chat/unread');
        if (messagesResponse.data) {
          setUnreadMessages(messagesResponse.data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error (token expired or invalid)
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token on logout
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
            <Settings size={24} />
          </div>

          <div className="profile-section">
            <img src={userProfile?.profilePic || defaultProfile} alt="Profile" className="profile-pic" />
            <h3>{userProfile?.name || name}</h3>
            <p>{userProfile?.role || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Mentor')}</p>
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
              {unreadMessages.length > 0 && (
                <span className="badge">{unreadMessages.length}</span>
              )}
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
