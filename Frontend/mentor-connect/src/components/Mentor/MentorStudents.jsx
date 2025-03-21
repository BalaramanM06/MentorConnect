import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./MentorStudents.css";

const MentorStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Sarah Connor", email: "sarah.connor@example.com" },
    { name: "Michael Lee", email: "michael.lee@example.com" },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/auth/profile");
        setCurrentUser(response.data);
      } catch {
        setCurrentUser({ name: "Mentor", email: "mentor@example.com", role: "MENTOR" });
      }
    } catch {
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openChat = (student) => {
    setSelectedStudent(student);
    setMessages([
      { sender: "mentor", text: `Hello ${student.name}, how can I assist you?` },
      { sender: "student", text: "Hi, I need some advice regarding my project." },
    ]);
  };

  const sendMessage = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      const updatedMessages = [...messages, { sender: "mentor", text: newMessage }];
      setMessages(updatedMessages);
      setNewMessage("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "student", text: "Thank you, that makes sense!" },
        ]);
      }, 1200);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mentor-chat-layout">
      <div className="mentor-sidebar">
        <h2>Students</h2>
        {students.map((student, index) => (
          <div
            key={index}
            className={`student-item ${selectedStudent === student ? "active" : ""}`}
            onClick={() => openChat(student)}
          >
            <span className="student-avatar">{student.name[0]}</span>
            <div className="student-info">
              <h4>{student.name}</h4>
              <p>{student.email}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mentor-chat-container">
        {selectedStudent ? (
          <>
            <div className="mentor-chat-header">
              <button className="chat-back-button" onClick={() => setSelectedStudent(null)}>⬅</button>
              <h3>{selectedStudent.name}</h3>
            </div>

            <div className="mentor-chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mentor-chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={sendMessage}
              />
            </div>
          </>
        ) : (
          <div className="mentor-chat-placeholder">Select a student to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default MentorStudents;
