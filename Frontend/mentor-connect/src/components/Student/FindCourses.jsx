import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindCourses.css";
import { Search, Filter, CheckCircle, Clock, PlayCircle } from "lucide-react";
import api from "../../utils/axiosConfig";

const FindCourses = () => {
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [courseAndMentor, setCourseAndMentor] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/mentee/getAllCourse");
        const enrolledResponse = await api.get("/mentee/getNewCourse");
        const completedResponse = await api.get("/mentee/getOldCourse");

        if (response.data) {
          setCourseDetails(response.data);
          const formattedCourses = response.data.map(data => ({
            courseName: data.course.courseName,
            description: data.course.description,
            id: data.course.id,
            level: "Intermediate",
            price: "Free",
            status: "Upcoming",
            duration: "90 min",
            mentor: `${data.user.firstName} ${data.user.lastName ? data.user.lastName : ""}`,
          }));
          setCourseAndMentor(formattedCourses);
        }
        if (enrolledResponse.data) {
          setEnrolledCourses(enrolledResponse.data.map(course => course.id));
        }
        if (completedResponse.data) {
          setCompletedCourses(completedResponse.data.map(course => course.id));
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
        {courseAndMentor.length > 0 ? (
          courseAndMentor.map((course, index) => (
            <div key={course.id || index} className="course-card">
              <div className="course-info">
                <h2>{course.courseName}</h2>
                <p className="course-instructor"><strong>Instructor:</strong> {course.mentor}</p>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Price:</strong> {course.price}</span>
                </div>
                <div className="course-status">
                  {enrolledCourses.includes(course.id) && (
                    <>
                      <CheckCircle className="status-icon completed" size={20} />
                      <span className="status-text">Enrolled</span>
                    </>
                  )}
                  {completedCourses.includes(course.id) && (
                    <>
                      <CheckCircle className="status-icon completed" size={20} />
                      <span className="status-text">Completed</span>
                    </>
                  )}
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