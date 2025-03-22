import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindCourses.css";
import { Search, Filter, CheckCircle, Clock, PlayCircle } from "lucide-react";
import api from "../../utils/axiosConfig";

const FindCourses = () => {
  const navigate = useNavigate();
  const [courseDetails , setCourseDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/mentee/getAllCourse");
        if(response.data){
          const allCourses = response.data.map(item => item.course);
          setCourseDetails(allCourses);
          console.log(allCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = (course) => {
    navigate("/enroll", { state: { course } });
  };

  return (
    <div className="courses-container">
      <header className="courses-header">
        <h1>Find Courses</h1>
        <div className="search-filter">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <div className="filter-dropdown">
              <Filter size={20} />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="courses-list">
        {courseDetails.length > 0 ? (
          courseDetails.map((course, index) => (
            <div key={course.id || index} className="course-card">
              <div className="course-info">
                <h2>{course.courseName}</h2>
                <p className="course-instructor"><strong>Instructor:</strong> {course.instructor || "N/A"}</p>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span><strong>Duration:</strong> {course.duration || "Unknown"}</span>
                  <span><strong>Price:</strong> {course.price || "Free"}</span>
                </div>
                <div className="course-tags">
                  {course.category && <span className="course-category">{course.category}</span>}
                  {course.level && <span className="course-level">{course.level}</span>}
                </div>
                <div className="course-status">
                  {course.status === "Completed" ? (
                    <CheckCircle className="status-icon completed" size={20} />
                  ) : course.status === "Ongoing" ? (
                    <PlayCircle className="status-icon ongoing" size={20} />
                  ) : (
                    <Clock className="status-icon upcoming" size={20} />
                  )}
                  <span className={`status-text ${course.status?.toLowerCase()}`}>{course.status || "Unknown"}</span>
                </div>
              </div>
          
              <div className="course-actions">
                {course.status === "Upcoming" && (
                  <button className="enroll-button" onClick={() => handleEnroll(course)}>
                    Enroll Now
                  </button>
                )}
                {course.status === "Ongoing" && (
                  <button className="continue-button" onClick={() => navigate(`/course/${course.id}`)}>
                    Continue
                  </button>
                )}
                {course.status === "Completed" && (
                  <button className="review-button" onClick={() => navigate(`/course/${course.id}/review`)}>
                    Write Review
                  </button>
                )}
              </div>
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
