import React, { useState } from "react";
import "./FindCourses.css";
import { Search, Filter, CheckCircle, Clock, PlayCircle } from "lucide-react";

const FindCourses = () => {
  const [courses] = useState([
    { id: 1, title: "Full-Stack Web Development", instructor: "John Doe", status: "Upcoming"},
    { id: 2, title: "Data Science with Python", instructor: "Jane Smith", status: "Completed"},
    { id: 3, title: "Cybersecurity Essentials", instructor: "Mark Wilson", status: "Upcoming"},
    { id: 4, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 5, title: "Artificial Intelligence and Machine Learning", instructor: "Emmastone", status: "Upcoming"},
    { id: 6, title: "Software Development", instructor: "George Steel", status: "Upcoming"},
    { id: 7, title: "", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 8, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 9, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 10, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Ongoing"},
    { id: 11, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 12, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 13, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Upcoming"},
    { id: 14, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Ongoing"},
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const filteredCourses = courses.filter((course) => {
    return (
      (filter === "All" || course.status === filter) &&
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="courses-container">
      <header className="courses-header">
        <h1>My Courses</h1>
        <div className="search-filter">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={20} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </header>

      {/* Course List */}
      <div className="courses-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-info">
                <h2>{course.title}</h2>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <div className="course-status">
                  {course.status === "Completed" ? (
                    <CheckCircle className="status-icon completed" size={20} />
                  ) : course.status === "Ongoing" ? (
                    <PlayCircle className="status-icon ongoing" size={20} />
                  ) : (
                    <Clock className="status-icon upcoming" size={20} />
                  )}
                  <span className={`status-text ${course.status.toLowerCase()}`}>{course.status}</span>
                </div>
              </div>

              {course.status === "Ongoing" && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-courses">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default FindCourses;
