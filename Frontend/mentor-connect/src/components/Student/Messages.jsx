import React, { useState } from "react";
import "./Messages.css";
import { Send, Paperclip, User, ChevronLeft } from "lucide-react";

const Messages = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chats, setChats] = useState({
    "Dr. Emily Carter": [],
    "Prof. John Smith": [],
    "Dr. Susan Lee": [],
    "Dr. Mark Johnson": [],
  });

  const mentors = Object.keys(chats);

  const handleSendMessage = () => {
    if (messageInput.trim() === "" || !selectedMentor) return;

    setChats({
      ...chats,
      [selectedMentor]: [...chats[selectedMentor], { sender: "You", text: messageInput }],
    });

    setMessageInput("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && selectedMentor) {
      setChats({
        ...chats,
        [selectedMentor]: [...chats[selectedMentor], { sender: "You", text: `📎 Sent file: ${file.name}` }],
      });
    }
  };

  return (
    <div className="messages-container">
      {/* Mentor List Sidebar */}
      <aside className={`mentor-sidebar ${selectedMentor ? "hidden" : ""}`}>
        <h2>Messages</h2>
        <ul>
          {mentors.map((mentor) => (
            <li key={mentor} onClick={() => setSelectedMentor(mentor)}>
              <User className="mentor-icon" size={40} />
              <div className="mentor-info">
                <h3>{mentor}</h3>
                <p className="online-status">Online</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat Window */}
      <div className={`chat-window ${selectedMentor ? "active" : ""}`}>
        {selectedMentor ? (
          <>
            {/* Chat Header */}
            <header className="chat-header">
              <ChevronLeft className="back-btn" size={24} onClick={() => setSelectedMentor(null)} />
              <User size={40} />
              <h3>{selectedMentor}</h3>
            </header>

            {/* Chat Messages */}
            <div className="chat-messages">
              {chats[selectedMentor].map((msg, index) => (
                <div key={index} className={`message ${msg.sender === "You" ? "sent" : "received"}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <footer className="chat-input">
              <label className="file-upload">
                <Paperclip size={20} />
                <input type="file" onChange={handleFileUpload} />
              </label>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button onClick={handleSendMessage}>
                <Send size={20} />
              </button>
            </footer>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a mentor to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
