import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, BookOpen, MessageCircle, Users, CreditCard, FileText, Settings, BookOpenCheck } from "lucide-react";
import "./StudentDashboard.css";
import defaultProfile from "../../assets/default-profile.jpeg";
import StudentNotification from "./StudentNotification";
import api from "../../utils/axiosConfig";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // User data state
  const [user, setUser] = useState(null);

  // Dashboard data states
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [currentMentors, setCurrentMentors] = useState([]);
  const [previousMentors, setPreviousMentors] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCourse, setAllCourse] = useState([]);

  useEffect(() => {
    // Check if we have a valid auth token
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if no token is found
      navigate('/login');
      return;
    }

    // Extract user info from token for fallback
    const extractUserFromToken = () => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const email = payload.sub || 'student@example.com';

        return {
          name: email.split('@')[0].replace('.', ' '),
          email: email,
          role: 'STUDENT'
        };
      } catch (error) {
        console.error("Error extracting user from token:", error);
        return {
          name: 'Student User',
          email: 'student@example.com',
          role: 'STUDENT'
        };
      }
    };

    // Fetch all user data from backend
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch user profile data
        try {
          const userResponse = await api.get('/auth/profile');
          if (userResponse.data) {
            setUser(userResponse.data);
          } else {
            // Fallback to extracted user from token
            setUser(extractUserFromToken());
          }
        } catch (userError) {
          console.error("Error fetching user profile:", userError);
          // Fallback to extracted user from token
          setUser(extractUserFromToken());
        }

        // Fetch enrolled courses
        try {
          const coursesResponse = await api.get('/mentee/getNewCourse');
          if (coursesResponse.data) {
            const courses = Array.isArray(coursesResponse.data)
              ? coursesResponse.data
              : (coursesResponse.data.courses || []);

            setEnrolledCourses(courses);

            // Save courses to localStorage for fallback
            localStorage.setItem("enrolledCourses", JSON.stringify(courses));

            // Extract current mentors from enrolled courses
            const currentMentorsData = [];
            courses.forEach(course => {
              if (course.mentor || course.mentorName) {
                currentMentorsData.push({
                  id: course.mentorId || `mentor-${Date.now()}`,
                  name: course.mentor || course.mentorName,
                  email: course.mentorEmail || `${(course.mentor || course.mentorName).toLowerCase().replace(/\s+/g, '.')}@example.com`,
                  courseId: course.id || course.courseId,
                  courseName: course.title || course.courseName
                });
              }
            });

            // Remove duplicates
            const uniqueMentors = Array.from(new Map(currentMentorsData.map(m => [m.email, m])).values());
            setCurrentMentors(uniqueMentors);
          }
        } catch (coursesError) {
          console.error("Error fetching enrolled courses:", coursesError);

          // Fallback - load enrolled courses from local storage if API fails
          const storedCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
          setEnrolledCourses(storedCourses);

          // Extract mentors from stored courses
          if (storedCourses.length > 0) {
            const storedMentors = storedCourses
              .filter(course => course.mentor || course.mentorName)
              .map(course => ({
                id: course.mentorId || `mentor-${Date.now()}`,
                name: course.mentor || course.mentorName,
                email: course.mentorEmail || `${(course.mentor || course.mentorName).toLowerCase().replace(/\s+/g, '.')}@example.com`,
                courseId: course.id || course.courseId,
                courseName: course.title || course.courseName
              }));

            // Remove duplicates
            const uniqueMentors = Array.from(new Map(storedMentors.map(m => [m.email, m])).values());
            setCurrentMentors(uniqueMentors);
          }
        }

        // Fetch previous mentors
        try {
          const previousMentorsResponse = await api.get('/mentee/getOldCourse');
          if (previousMentorsResponse.data) {
            const oldCourses = Array.isArray(previousMentorsResponse.data)
              ? previousMentorsResponse.data
              : (previousMentorsResponse.data.courses || []);

            // Extract mentors from old courses
            const oldMentors = oldCourses
              .filter(course => course.mentor || course.mentorName)
              .map(course => ({
                id: course.mentorId || `mentor-${Date.now()}`,
                name: course.mentor || course.mentorName,
                email: course.mentorEmail || `${(course.mentor || course.mentorName).toLowerCase().replace(/\s+/g, '.')}@example.com`,
                courseId: course.id || course.courseId,
                courseName: course.title || course.courseName
              }));

            setPreviousMentors(oldMentors);
          }
        } catch (previousError) {
          console.error("Error fetching previous mentors:", previousError);
          setPreviousMentors([]);
        }

        // Fetch scheduled sessions
        try {
          const sessionsResponse = await api.get('/mentee/getPendingRequest');
          if (sessionsResponse.data) {
            const sessions = Array.isArray(sessionsResponse.data)
              ? sessionsResponse.data
              : (sessionsResponse.data.sessions || []);

            setScheduledSessions(sessions);
          }
        } catch (sessionsError) {
          console.error("Error fetching scheduled sessions:", sessionsError);
          setScheduledSessions([]);
        }

        // Fetch all courses
        try {
          const allCoursesResponse = await api.get('/mentee/getAllCourse');
          if (allCoursesResponse.data) {
            const courses = Array.isArray(allCoursesResponse.data)
              ? allCoursesResponse.data
              : (allCoursesResponse.data.courses || []);

            setAllCourse(courses);
          }
        } catch (allCoursesError) {
          console.error("Error fetching all courses:", allCoursesError);
          setAllCourse([]);
        }

      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load your dashboard data. Please try again later.");

        // If the error is due to authentication (401), redirect to login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the fetch function
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear auth token on logout
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  const handleContinue = (courseId) => {
    console.log(`Continuing course with ID: ${courseId}`);
    navigate(`/course/${courseId}`);
  };

  // Function to handle clicking on a message or mentor
  const handleMessageClick = (mentor) => {
    // Navigate to messages page with the selected mentor
    navigate('/messages', {
      state: {
        selectedMentor: mentor.name,
        selectedMentorEmail: mentor.email
      }
    });
  };

  // Function to handle clicking on Messages nav item
  const handleMessagesNavClick = () => {
    navigate('/messages');
  };

  // Show loading indicator while fetching data
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
      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-profile">
          <img src={user?.profilePic || defaultProfile} alt="Profile" />
          <div className="profile-info">
            <h3>{user?.name || "Student"}</h3>
            <p>{user?.email || "student@example.com"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <BookOpen size={20} />
              <span>Dashboard</span>
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
            <li onClick={() => navigate('/find-mentor')}>
              <Users size={20} />
              <span>Find Mentors</span>
            </li>
            <li onClick={() => navigate('/student-resources')}>
              <FileText size={20} />
              <span>Resources</span>
            </li>
            <li onClick={() => navigate('/payment')}>
              <CreditCard size={20} />
              <span>Payments</span>
            </li>
            <li onClick={() => navigate('/settings')}>
              <Settings size={20} />
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        <header className="dashboard-header">
          <h1>Welcome, {user?.name || "Student"}!</h1>
          <StudentNotification />
        </header>

        {/* Dashboard Cards Section */}
        <div className="dashboard-cards">
          {/* Enrolled Courses Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Current Courses</h2>
              <button onClick={() => navigate('/course-tracker')}>View All</button>
            </div>
            <div className="card-content">
              {enrolledCourses.length > 0 ? (
                <div className="course-list">
                  {enrolledCourses.slice(0, 3).map((course, index) => (
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

          {/* Mentors Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>My Mentors</h2>
            </div>
            <div className="card-content">
              {currentMentors.length > 0 ? (
                <div className="mentors-list">
                  {currentMentors.slice(0, 3).map((mentor, index) => (
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

          {/* Upcoming Sessions Card */}
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
