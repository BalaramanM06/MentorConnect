import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindCourses.css";
import { Search, Filter, CheckCircle, Clock, PlayCircle } from "lucide-react";

const FindCourses = () => {
  const navigate = useNavigate();
  const [courses] = useState([
    { id: 1, title: "Full-Stack Web Development", instructor: "John Doe", status: "Upcoming", description: "Learn to build complete web applications from front-end to back-end.", duration: "12 weeks", price: "$199", category: "Web Development", level: "Intermediate" },
    { id: 2, title: "Data Science with Python", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Master data analysis, visualization, and machine learning with Python.", duration: "10 weeks", price: "$149", category: "Data Science", level: "Beginner" },
    { id: 3, title: "Cybersecurity Fundamentals", instructor: "Prof. John Smith", status: "Upcoming", description: "Learn the fundamentals of cybersecurity and protect against threats.", duration: "8 weeks", price: "$179", category: "Security", level: "Beginner" },
    { id: 4, title: "Advanced Data Analysis", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Take your data analysis skills to the next level with advanced statistical methods.", duration: "6 weeks", price: "$129", category: "Data Science", level: "Advanced" },
    { id: 5, title: "Artificial Intelligence", instructor: "Dr. Susan Lee", status: "Upcoming", description: "Understand AI concepts and implement machine learning models.", duration: "14 weeks", price: "$249", category: "AI & ML", level: "Intermediate" },
    { id: 6, title: "Cloud Systems Architecture", instructor: "Dr. Mark Johnson", status: "Upcoming", description: "Learn to design and implement cloud-based systems and architecture.", duration: "10 weeks", price: "$189", category: "Cloud Computing", level: "Advanced" },
    { id: 7, title: "Machine Learning Fundamentals", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Combine Python programming with machine learning algorithms.", duration: "12 weeks", price: "$199", category: "Data Science", level: "Intermediate" },
    { id: 8, title: "Ethical Hacking", instructor: "Prof. John Smith", status: "Upcoming", description: "Master ethical hacking techniques to improve security systems.", duration: "8 weeks", price: "$159", category: "Security", level: "Intermediate" },
    { id: 9, title: "Distributed Computing", instructor: "Dr. Mark Johnson", status: "Upcoming", description: "Learn to deploy and manage distributed computing systems.", duration: "9 weeks", price: "$169", category: "Cloud Computing", level: "Advanced" },
    { id: 10, title: "Deep Learning Applications", instructor: "Dr. Susan Lee", status: "Upcoming", description: "Build practical applications using deep learning neural networks.", duration: "7 weeks", price: "$119", category: "AI & ML", level: "Advanced" },
    { id: 11, title: "Problem Solving using C", instructor: "Rose", status: "Ongoing", description: "Develop problem-solving skills using C programming.", duration: "7 weeks", price: "$119", category: "Programming", level: "Beginner" },
    { id: 12, title: "Data Structure and Algorithms", instructor: "Joseph", status: "Upcoming", description: "Master data structures and algorithms for efficient programming.", duration: "11 weeks", price: "$189", category: "Programming", level: "Intermediate" },
    { id: 13, title: "Software Testing", instructor: "James", status: "Upcoming", description: "Understand software testing methodologies and tools.", duration: "6 weeks", price: "$139", category: "Software Development", level: "Beginner" },
    { id: 14, title: "Software Engineering", instructor: "Carl Mathos", status: "Ongoing", description: "Learn software engineering principles and practices.", duration: "12 weeks", price: "$199", category: "Software Development", level: "Intermediate" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredCourses = courses.filter((course) => {
    return (
      (filter === "All" || course.status === filter) &&
      (categoryFilter === "All" || course.category === categoryFilter) &&
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  const handleEnroll = (course) => {
    // Navigate to enrollment page with course data
    navigate("/enroll", { state: { course } });
  };

  const categories = ["All", ...new Set(courses.map(course => course.category))];

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
            <div className="filter-dropdown">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
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
                <p className="course-instructor"><strong>Instructor:</strong> {course.instructor}</p>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <span><strong>Duration:</strong> {course.duration}</span>
                  <span><strong>Price:</strong> {course.price}</span>
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
                  <span className={`status-text ${course.status.toLowerCase()}`}>{course.status}</span>
                </div>
              </div>

              <div className="course-actions">
                {course.status === "Upcoming" && (
                  <button
                    className="enroll-button"
                    onClick={() => handleEnroll(course)}
                  >
                    Enroll Now
                  </button>
                )}
                {course.status === "Ongoing" && (
                  <button
                    className="continue-button"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    Continue
                  </button>
                )}
                {course.status === "Completed" && (
                  <button
                    className="review-button"
                    onClick={() => navigate(`/course/${course.id}/review`)}
                  >
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
