import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import "./Messages.css";

const Messages = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([
    { name: "Dr. Alice Johnson", email: "alice.johnson@example.com" },
    { name: "Prof. Bob Smith", email: "bob.smith@example.com" },
    { name: "Dr. Carol Lee", email: "carol.lee@example.com" },
  ]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const extractEmailFromToken = useCallback((token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload).sub || "student@example.com";
    } catch (error) {
      console.error("Error extracting email from token:", error);
      return "student@example.com";
    }
  }, []);

  const fetchUserData = useCallback(async () => {
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
        const email = extractEmailFromToken(token);
        setCurrentUser({
          email,
          name: email.split("@")[0].replace(".", " "),
          role: "STUDENT",
        });
      }
    } catch (err) {
      setError("Failed to load user profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, extractEmailFromToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const openChat = (mentor) => {
    setSelectedMentor(mentor);
    setMessages([
      { sender: "mentor", text: `Hello! I am ${mentor.name}. How can I assist you?` },
      { sender: "student", text: "Hi! I need some guidance on my project." },
    ]);
  };

  const sendMessage = (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      const updatedMessages = [...messages, { sender: "student", text: newMessage }];
      setMessages(updatedMessages);
      setNewMessage("");

      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "mentor", text: "That’s a great question! Let's discuss it further." },
        ]);
      }, 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-layout">
      <div className="sidebar">
        <h2>Mentors</h2>
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className={`mentor-item ${selectedMentor === mentor ? "active" : ""}`}
            onClick={() => openChat(mentor)}
          >
            <span className="mentor-avatar">{mentor.name[0]}</span>
            <div className="mentor-info">
              <h4>{mentor.name}</h4>
              <p>{mentor.email}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-container">
        {selectedMentor ? (
          <>
            <div className="chat-header">
              <button className="chat-back-button" onClick={() => setSelectedMentor(null)}>⬅</button>
              <h3>{selectedMentor.name}</h3>
            </div>

            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
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
          <div className="chat-placeholder">Select a mentor to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
