import React, { useState } from "react";
import "./FindingMentor.css";
import { Search, Filter, Star, MessageCircle, User, Calendar } from "lucide-react";

const FindingMentor = () => {
  // Sample Mentors Data
  const [mentors] = useState([
    { id: 1, name: "Dr. Emily Carter", specialization: "Data Science", rating: 4.8, university: "MIT" },
    { id: 2, name: "Prof. John Smith", specialization: "Cybersecurity", rating: 4.5, university: "Stanford" },
    { id: 3, name: "Dr. Susan Lee", specialization: "AI & ML", rating: 4.9, university: "Harvard" },
    { id: 4, name: "Dr. Mark Johnson", specialization: "Cloud Computing", rating: 4.7, university: "UC Berkeley" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // Filtered Mentors
  const filteredMentors = mentors.filter((mentor) => {
    return (
      (filter === "All" || mentor.specialization === filter) &&
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mentors-container">
      <header className="mentors-header">
        <h1>Find a Mentor</h1>
        <div className="search-filter">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={20} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="AI & ML">AI & ML</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>
          </div>
        </div>
      </header>

      {/* Mentor List */}
      <div className="mentors-list">
        {filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <div className="mentor-info">
                <User className="mentor-icon" size={60} />
                <div className="mentor-details">
                  <h2>{mentor.name}</h2>
                  <p><strong>Specialization:</strong> {mentor.specialization}</p>
                  <p><strong>University:</strong> {mentor.university}</p>
                  <div className="mentor-rating">
                    <Star className="star-icon" size={18} />
                    <span>{mentor.rating} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mentor-actions">
                <button className="chat-btn">
                  <MessageCircle size={18} /> Chat
                </button>
                <button className="schedule-btn">
                  <Calendar size={18} /> Schedule
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-mentors">No mentors found.</p>
        )}
      </div>

      {/* Floating Calendar Icon */}
      <div className="floating-calendar">
        <Calendar size={30} />
      </div>
    </div>
  );
};

export default FindingMentor;
