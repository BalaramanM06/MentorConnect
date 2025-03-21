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
  const location = useLocation();
  const { firstName, email, role } = location.state || {};

  const [activeTab, setActiveTab] = useState("upcoming");
  const [userProfile, setUserProfile] = useState({});
  const [unreadMessages, setUnreadMessages] = useState([]);

  const extractUserFromToken = () => {
    try {
      const token = localStorage.getItem('authToken');
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      const email = payload.sub || 'mentor@example.com';

      return {
        firstName: email.split('@')[0].replace('.', ' '),
        email: email,
        role: 'MENTOR'
      };
    } catch (error) {
      console.error("Error extracting user from token:", error);
      return {
        firstName: 'Mentor User',
        email: 'mentor@example.com',
        role: 'MENTOR'
      };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Extract user info from token
    const tokenUser = extractUserFromToken();

    const fetchUserData = async () => {
      try {
        const { email } = tokenUser;
        const password = 'user_password';
        const authResponse = await api.post('/api/auth/login', { email, password });
        if (authResponse.data) {
          const profileResponse = await api.get('/api/profile', {
            params: { email: authResponse.data.email }
          });
          setUserProfile(profileResponse.data);
        }

        const messagesResponse = await api.get('/api/chat/unread');
        if (messagesResponse.data) {
          setUnreadMessages(messagesResponse.data.messages || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          setUserProfile(tokenUser);
        }
      }
    };

    fetchUserData();
  }, [navigate]);

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
            <h3>{userProfile?.firstName || userProfile?.name || firstName || "Mentor Name"}</h3>
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
