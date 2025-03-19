import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Messages.css";
import { Send, Paperclip, User, ChevronLeft, Search, Clock, Calendar, FileText, CheckCircle, X } from "lucide-react";
import defaultAvatar from "../../assets/default-profile.jpeg";

const Messages = () => {
  const location = useLocation();
  const receivedMentorName = location.state?.selectedMentor || null;

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [enrolledMentors, setEnrolledMentors] = useState([]);
  const [chats, setChats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch enrolled mentors from localStorage on component mount
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");

    // Extract unique mentors from enrolled courses
    const mentors = enrolledCourses.reduce((acc, course) => {
      if (course.instructor && !acc.some(m => m.name === course.instructor)) {
        acc.push({
          name: course.instructor,
          courseName: course.title,
          status: course.status,
          lastActive: new Date().toISOString(),
          avatar: course.instructorAvatar || defaultAvatar,
          isOnline: Math.random() > 0.5 // Randomly set online status for demo
        });
      }
      return acc;
    }, []);

    // Initialize empty chat history for each mentor
    const initialChats = mentors.reduce((acc, mentor) => {
      acc[mentor.name] = [];
      return acc;
    }, {});

    setEnrolledMentors(mentors);
    setChats(initialChats);

    // Show empty state if no enrolled mentors
    setShowEmptyState(mentors.length === 0);

    // If a mentor was passed from another component, select them automatically
    if (receivedMentorName && mentors.some(m => m.name === receivedMentorName)) {
      setSelectedMentor(receivedMentorName);
    }
  }, [receivedMentorName]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedMentor) return;

    // Add user message
    const updatedChats = {
      ...chats,
      [selectedMentor]: [...chats[selectedMentor], { sender: "You", text: messageInput, timestamp: new Date() }],
    };

    setChats(updatedChats);
    setMessageInput("");

    // No auto-reply functionality
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedMentor) {
      setChats({
        ...chats,
        [selectedMentor]: [
          ...chats[selectedMentor],
          {
            sender: "You",
            text: `📎 File: ${file.name}`,
            isFile: true,
            filename: file.name,
            filesize: formatFileSize(file.size),
            timestamp: new Date()
          }
        ],
      });

      // No automatic response
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredMentors = enrolledMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-container">
      {/* Mentor List Sidebar */}
      <aside className={`mentor-sidebar ${selectedMentor ? "hidden" : ""}`}>
        <h2>Messages</h2>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {showEmptyState ? (
          <div className="empty-mentors">
            <p>You haven't enrolled with any mentors yet.</p>
            <button className="find-mentors-btn" onClick={() => window.location.href = "/finding-mentor"}>
              Find Mentors
            </button>
          </div>
        ) : (
          <ul className="mentor-list">
            {filteredMentors.map((mentor) => (
              <li
                key={mentor.name}
                className={`mentor-item ${selectedMentor === mentor.name ? "active" : ""}`}
                onClick={() => setSelectedMentor(mentor.name)}
              >
                <div className="mentor-avatar">
                  <img src={mentor.avatar || defaultAvatar} alt={mentor.name} />
                  <span className={`status-indicator ${mentor.isOnline ? "online" : "offline"}`}></span>
                </div>
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <p className="course-name">{mentor.courseName}</p>
                  <div className="mentor-status">
                    {mentor.status === "Ongoing" ? (
                      <span className="status current"><Clock size={12} /> Current Mentor</span>
                    ) : (
                      <span className="status past"><CheckCircle size={12} /> Past Mentor</span>
                    )}
                  </div>
                </div>
                <span className="last-active">
                  {new Date(mentor.lastActive).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Chat Window */}
      <div className={`chat-window ${selectedMentor ? "active" : ""}`}>
        {selectedMentor ? (
          <>
            {/* Chat Header */}
            <header className="chat-header">
              <div className="header-left">
                <ChevronLeft className="back-btn" size={24} onClick={() => setSelectedMentor(null)} />
                <div className="selected-mentor-avatar">
                  <img
                    src={enrolledMentors.find(m => m.name === selectedMentor)?.avatar || defaultAvatar}
                    alt={selectedMentor}
                  />
                  <span className={`status-indicator ${enrolledMentors.find(m => m.name === selectedMentor)?.isOnline ? "online" : "offline"}`}></span>
                </div>
                <div className="selected-mentor-info">
                  <h3>{selectedMentor}</h3>
                  <p className="mentor-course">
                    {enrolledMentors.find(m => m.name === selectedMentor)?.courseName}
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button className="header-action-btn" title="Schedule Meeting">
                  <Calendar size={22} />
                </button>
                <button className="header-action-btn" title="View Documents">
                  <FileText size={22} />
                </button>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="chat-messages">
              {chats[selectedMentor]?.length === 0 ? (
                <div className="empty-chat">
                  <div className="empty-chat-icon">
                    <User size={40} />
                  </div>
                  <h3>Start a conversation with {selectedMentor}</h3>
                  <p>Messages sent here will be delivered to your mentor. They will respond when available.</p>
                </div>
              ) : (
                <>
                  {chats[selectedMentor].map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "You" ? "sent" : "received"}`}>
                      {msg.isFile ? (
                        <div className="file-message">
                          <Paperclip size={18} />
                          <div className="file-details">
                            <span className="file-name">{msg.filename}</span>
                            <span className="file-size">{msg.filesize}</span>
                          </div>
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="message received typing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Input */}
            <footer className="chat-input">
              <label className="file-upload" title="Attach File">
                <Paperclip size={24} />
                <input type="file" onChange={handleFileUpload} />
              </label>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                title="Send Message"
              >
                <Send size={24} />
              </button>
            </footer>
          </>
        ) : (
          <div className="no-chat-selected">
            {showEmptyState ? (
              <div className="empty-state-container">
                <h3>No Mentors Available</h3>
                <p>Enroll in courses to connect with mentors</p>
                <button className="browse-courses-btn" onClick={() => window.location.href = "/find-courses"}>
                  Browse Courses
                </button>
              </div>
            ) : (
              <p>Select a mentor to start chatting</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
