import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, BookOpen, MessageCircle, Users, CreditCard, FileText, Settings, BookOpenCheck, TvMinimalIcon } from "lucide-react";
import "./StudentDashboard.css";
import defaultProfile from "../../assets/default-profile.jpeg";
import StudentNotification from "./StudentNotification";
import SettingsMenu from "./Settings";
import api from "../../utils/axiosConfig";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState([]);
  const [oldCourses , setOldCourses] = useState([]) ;
  const [newCourses , setNewCourses] = useState([]) ;
  const [courseDetail, setCourseDetail] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCourse, setAllCourse] = useState([]);

  useEffect(() => {
    fetchMentorDetails();
}, []);

const fetchMentorDetails = async () => {
    setError(null);
    const token = localStorage.getItem("authToken");

    if (!token) {
        setError("Authentication token missing. Please log in.");
        setIsLoading(false);
        navigate("/login");
        return;
    }

    try {
        const response = await api.get("/auth/profile");
        const allCourseResponse = await api.get('/mentee/getAllCourse');
        const enrolledCourseResponse = await api.get('/mentee/getNewCourse');
        const oldCourseResponse = await api.get('/mentee/getOldCourse');
        const pendingRequestResponse = await api.get('/mentee/getPendingRequest');  
        const courseDetailResponse = await api.get('/mentee/getMenteeCourseDetail');
        if (response.data?.email) {
            setUserProfile(response.data);
            console.log(response.data);
        }
        if (allCourseResponse.data) {
            setAllCourse(allCourseResponse.data);
        }
        if (enrolledCourseResponse.data) {
            setNewCourses(enrolledCourseResponse.data);
        }
        if (oldCourseResponse.data) {
            setOldCourses(oldCourseResponse.data);
        }
        if (pendingRequestResponse.data) {
            setPendingRequest(pendingRequestResponse.data);
        }
        if (courseDetailResponse.data) {
            setCourseDetail(courseDetailResponse.data);
        }
    } catch (err) {
        console.error("Error fetching mentor details:", err);
        setError("Failed to fetch mentor details.");
    } finally {
        setIsLoading(false);  
    }
};


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  const handleContinue = (courseId) => {
    console.log(`Continuing course with ID: ${courseId}`);
    navigate(`/course/${courseId}`);
  };

  const handleMessageClick = (mentor) => {
    navigate('/messages', {
      state: {
        selectedMentor: mentor.name,
        selectedMentorEmail: mentor.email
      }
    });
  };

  const handleMessagesNavClick = () => {
    navigate('/messages');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-profile">
            <img src={userProfile?.profilePic || defaultProfile} alt="Profile" />
            <div className="profile-info">
              <h3>{userProfile?.firstName || "Student"}</h3>
              <p>{userProfile?.email || "student@example.com"}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <BookOpen size={20} />
              <span>Dashboard</span>
            </li>
            <li onClick={() => navigate('/upcoming-sessions')}>
              <TvMinimalIcon size={20} />
              <span>UpComing Sessions</span>
            </li>
            <li onClick={() => navigate('/course-tracker')}>
              <BookOpenCheck size={20} />
              <span>My Courses</span>
            </li>
            <li onClick={handleMessagesNavClick}>
              <MessageCircle size={20} />
              <span>Messages</span>
              {unreadMessages.length > 0 && (
                <span className="badge">{unreadMessages.length}</span>
              )}
            </li>
            <li onClick={() => navigate('/find-courses')}>
              <Users size={20} />
              <span>Find Courses</span>
            </li>
            <li onClick={() => navigate('/payment')}>
              <CreditCard size={20} />
              <span>Payments</span>
            </li>
          </ul>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <div className="dashboard-content">
        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        <header className="dashboard-header">
          <h1>Welcome, {userProfile?.firstName || "Student"}!</h1>
          <StudentNotification />
        </header>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Current Courses</h2>
              <button onClick={() => navigate('/course-tracker')}>View All</button>
            </div>
            <div className="card-content">
              {newCourses.length > 0 ? (
                <div className="course-list">
                  {newCourses.slice(0, 3).map((course, index) => (
                    <div className="course-item" key={index}>
                      <div className="course-icon">
                        <BookOpenCheck size={20} />
                      </div>
                      <div className="course-info">
                        <h3>{course.title || course.courseName}</h3>
                        <p>Mentor: {course.mentor || course.mentorName}</p>
                      </div>
                      <button
                        className="continue-btn"
                        onClick={() => handleContinue(course.id || course.courseId)}
                      >
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You're not enrolled in any courses yet.</p>
                  <button onClick={() => navigate('/find-courses')}>
                    Find Courses
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>My Mentors</h2>
            </div>
            <div className="card-content">
              {pendingRequest.length > 0 ? (
                <div className="mentors-list">
                  {pendingRequest.slice(0, 3).map((mentor, index) => (
                    <div className="mentor-item" key={index}>
                      <div className="mentor-avatar">
                        <img src={mentor.profilePic || defaultProfile} alt={mentor.name} />
                      </div>
                      <div className="mentor-info">
                        <h3>{mentor.name}</h3>
                        <p>{mentor.courseName}</p>
                      </div>
                      <button
                        className="message-btn"
                        onClick={() => handleMessageClick(mentor)}
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You don't have any mentors yet.</p>
                  <button onClick={() => navigate('/find-mentor')}>
                    Find Mentors
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2>Upcoming Sessions</h2>
            </div>
            <div className="card-content">
              {scheduledSessions.length > 0 ? (
                <div className="sessions-list">
                  {scheduledSessions.slice(0, 3).map((session, index) => (
                    <div className="session-item" key={index}>
                      <div className="session-icon">
                        <BookOpen size={20} />
                      </div>
                      <div className="session-info">
                        <h3>{session.title || session.courseName}</h3>
                        <p>Mentor: {session.mentor || session.mentorName}</p>
                        <p className="session-time">
                          {new Date(session.scheduledDate || session.date).toLocaleDateString()} at {new Date(session.scheduledDate || session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No upcoming sessions scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
