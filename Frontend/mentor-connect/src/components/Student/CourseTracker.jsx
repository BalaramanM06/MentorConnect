import React, { useState } from "react";
import "./CourseTracker.css";
import { CheckCircle, Clock, Filter } from "lucide-react";

const CourseTracker = () => {
  const [filter, setFilter] = useState("All");
  
  const courses = [
    { id: 1, name: "Advanced Cybersecurity", status: "Ongoing", progress: 65 },
    { id: 2, name: "Ethical Hacking Fundamentals", status: "Completed", progress: 100, certificate: true },
    { id: 3, name: "Machine Learning for Security", status: "Ongoing", progress: 45 },
    { id: 4, name: "Web Application Security", status: "Completed", progress: 100, certificate: true },
    { id: 5, name: "Digital Forensics & Incident Response", status: "Ongoing", progress: 30 },
  ];

  const filteredCourses = filter === "All" ? courses : courses.filter(course => course.status === filter);

  return (
    <div className="course-tracker-container">
      <h2>My Courses</h2>

      {/* Filter Options */}
      <div className="filter-section">
        <Filter size={20} />
        <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All</button>
        <button className={filter === "Ongoing" ? "active" : ""} onClick={() => setFilter("Ongoing")}>Ongoing</button>
        <button className={filter === "Completed" ? "active" : ""} onClick={() => setFilter("Completed")}>Completed</button>
      </div>

      {/* Course List */}
      <div className="course-list">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className={course.status === "Completed" ? "completed" : "ongoing"}>
                {course.status === "Completed" ? <CheckCircle size={16} color="green" /> : <Clock size={16} color="orange" />} {course.status}
              </p>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="progress-text">{course.progress}% Completed</p>
              {course.status === "Completed" && course.certificate && (
                <a href="#" className="certificate-link">🎓 Download Certificate</a>
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

export default CourseTracker;
