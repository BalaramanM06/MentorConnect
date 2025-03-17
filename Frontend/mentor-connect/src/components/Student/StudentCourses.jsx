import React, { useState } from "react";
import "./StudentCourses.css";
import { Search, Filter, CheckCircle, Clock, PlayCircle } from "lucide-react";

const StudentCourses = () => {
  const [courses] = useState([
    { id: 1, title: "Full-Stack Web Development", instructor: "John Doe", status: "Ongoing", progress: 75 },
    { id: 2, title: "Data Science with Python", instructor: "Jane Smith", status: "Completed", progress: 100 },
    { id: 3, title: "Cybersecurity Essentials", instructor: "Mark Wilson", status: "Upcoming", progress: 0 },
    { id: 4, title: "React & Redux Mastery", instructor: "Emily Johnson", status: "Ongoing", progress: 40 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  // Filtered Courses
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

              {/* Progress Bar for Ongoing Courses */}
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

export default StudentCourses;
