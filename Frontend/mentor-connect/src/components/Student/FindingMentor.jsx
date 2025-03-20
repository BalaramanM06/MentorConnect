import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindingMentor.css";
import { Search, Filter, Star, MessageCircle, Award, Book, Briefcase, Clock } from "lucide-react";
import defaultAvatar from "../../assets/default-profile.jpeg";

const FindingMentor = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    // Get courses data from FindCourses
    const coursesData = [
      { id: 1, title: "Full-Stack Web Development", instructor: "John Doe", status: "Upcoming", description: "Learn to build complete web applications from front-end to back-end.", duration: "12 weeks", price: "$199", category: "Web Development", level: "Intermediate" },
      { id: 2, title: "Data Science with Python", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Master data analysis, visualization, and machine learning with Python.", duration: "10 weeks", price: "$149", category: "Data Science", level: "Beginner" },
      { id: 3, title: "Cybersecurity Fundamentals", instructor: "Prof. John Smith", status: "Upcoming", description: "Learn the fundamentals of cybersecurity and protect against threats.", duration: "8 weeks", price: "$179", category: "Security", level: "Beginner" },
      { id: 4, title: "Advanced Data Analysis", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Take your data analysis skills to the next level with advanced statistical methods.", duration: "6 weeks", price: "$129", category: "Data Science", level: "Advanced" },
      { id: 5, title: "Artificial Intelligence", instructor: "Dr. Susan Lee", status: "Upcoming", description: "Understand AI concepts and implement machine learning models.", duration: "14 weeks", price: "$249", category: "AI & ML", level: "Intermediate" },
      { id: 6, title: "Cloud Systems Architecture", instructor: "Dr. Mark Johnson", status: "Upcoming", description: "Learn to design and implement cloud-based systems and architecture.", duration: "10 weeks", price: "$189", category: "Cloud Computing", level: "Advanced" },
      { id: 7, title: "Machine Learning Fundamentals", instructor: "Dr. Emily Carter", status: "Upcoming", description: "Combine Python programming with machine learning algorithms.", duration: "12 weeks", price: "$199", category: "Data Science", level: "Intermediate" },
      { id: 8, title: "Ethical Hacking", instructor: "Prof. John Smith", status: "Upcoming", description: "Master ethical hacking techniques to improve security systems.", duration: "8 weeks", price: "$159", category: "Security", level: "Intermediate" },
      { id: 9, title: "Distributed Computing", instructor: "Dr. Mark Johnson", status: "Upcoming", description: "Learn to deploy and manage distributed computing systems.", duration: "9 weeks", price: "$169", category: "Cloud Computing", level: "Advanced" },
      { id: 10, title: "Deep Learning Applications", instructor: "Dr. Susan Lee", status: "Upcoming", description: "Build practical applications using deep learning neural networks.", duration: "7 weeks", price: "$119", category: "AI & ML", level: "Advanced" }
    ];

    setAvailableCourses(coursesData);

    // Initialize mentors with enhanced data
    const mentorsData = [
      {
        id: 1,
        name: "Dr. Emily Carter",
        specialization: "Data Science",
        rating: 4.8,
        university: "MIT",
        avatar: defaultAvatar,
        bio: "Expert in statistical analysis with 10+ years of teaching experience",
        courses: [
          { id: 2, title: "Data Science with Python" },
          { id: 4, title: "Advanced Data Analysis" },
          { id: 7, title: "Machine Learning Fundamentals" }
        ],
        availability: "Mon, Wed, Fri",
        jobTitle: "Professor of Data Science"
      },
      {
        id: 2,
        name: "Prof. John Smith",
        specialization: "Cybersecurity",
        rating: 4.5,
        university: "Stanford",
        avatar: defaultAvatar,
        bio: "Specializing in network security and ethical hacking",
        courses: [
          { id: 3, title: "Cybersecurity Fundamentals" },
          { id: 8, title: "Ethical Hacking" }
        ],
        availability: "Tue, Thu",
        jobTitle: "Associate Professor of Computer Security"
      },
      {
        id: 3,
        name: "Dr. Susan Lee",
        specialization: "AI & ML",
        rating: 4.9,
        university: "Harvard",
        avatar: defaultAvatar,
        bio: "Focused on deep learning and neural networks",
        courses: [
          { id: 5, title: "Artificial Intelligence" },
          { id: 10, title: "Deep Learning Applications" }
        ],
        availability: "Mon, Wed, Fri",
        jobTitle: "Research Director, AI Lab"
      },
      {
        id: 4,
        name: "Dr. Mark Johnson",
        specialization: "Cloud Computing",
        rating: 4.7,
        university: "UC Berkeley",
        avatar: defaultAvatar,
        bio: "Cloud architecture expert with industry experience at AWS",
        courses: [
          { id: 6, title: "Cloud Systems Architecture" },
          { id: 9, title: "Distributed Computing" }
        ],
        availability: "Mon, Tue, Wed",
        jobTitle: "Professor of Cloud Computing"
      },
    ];

    setMentors(mentorsData);

    // Get enrolled courses for checking if student already has a certain mentor
    const storedCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    setEnrolledCourses(storedCourses);
  }, []);

  // Filtered Mentors
  const filteredMentors = mentors.filter((mentor) => {
    return (
      (filter === "All" || mentor.specialization === filter) &&
      (mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.university.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Handle chat with mentor
  const handleChatWithMentor = (mentor) => {
    // Create temporary chat entry if not already in enrolled courses
    const isMentorInCourses = enrolledCourses.some(course => course.instructor === mentor.name);

    // If not already enrolled with this mentor, create temporary entry
    if (!isMentorInCourses) {
      const tempCourseData = {
        id: `temp-${mentor.id}`,
        title: mentor.courses[0]?.title || mentor.specialization,
        instructor: mentor.name,
        instructorAvatar: mentor.avatar,
        status: "Ongoing",
        enrollmentDate: new Date().toISOString(),
        progress: 0
      };

      // Add to local storage temporarily for chat functionality
      const updatedEnrolledCourses = [...enrolledCourses, tempCourseData];
      localStorage.setItem("enrolledCourses", JSON.stringify(updatedEnrolledCourses));
    }

    // Navigate to messages page with the mentor name
    navigate("/messages", { state: { selectedMentor: mentor.name } });
  };

  // Handle course enrollment
  const handleEnrollCourse = (courseId, mentorName) => {
    // Find the full course details from available courses
    const courseDetails = availableCourses.find(course => course.id === courseId);

    if (courseDetails) {
      // Navigate to enrollment page with course data
      navigate("/enroll", {
        state: {
          course: {
            ...courseDetails,
            instructor: mentorName  // Ensure the instructor is set correctly
          }
        }
      });
    }
  };

  return (
    <div className="mentors-container">
      <header className="mentors-header">
        <h1>Find a Mentor</h1>
        <div className="search-filter">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search mentors by name, specialty, or university..."
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
                <div className="mentor-avatar">
                  <img src={mentor.avatar} alt={mentor.name} />
                </div>
                <div className="mentor-details">
                  <h2>{mentor.name}</h2>
                  <p className="mentor-title">
                    <Briefcase size={16} /> {mentor.jobTitle}
                  </p>
                  <p className="mentor-specialization">
                    <Award size={16} /> <strong>Specialization:</strong> {mentor.specialization}
                  </p>
                  <p className="mentor-university">
                    <Book size={16} /> <strong>University:</strong> {mentor.university}
                  </p>
                  <div className="mentor-rating">
                    <Star className="star-icon" size={18} />
                    <span>{mentor.rating} / 5.0</span>
                  </div>
                  <p className="mentor-bio">{mentor.bio}</p>
                  <div className="mentor-courses-section">
                    <strong>Courses:</strong>
                    <div className="mentor-courses-list">
                      {mentor.courses.map((course) => (
                        <div
                          key={course.id}
                          className="course-tag clickable"
                          onClick={() => handleEnrollCourse(course.id, mentor.name)}
                          title="Click to enroll in this course"
                        >
                          <Clock size={14} className="course-icon" /> {course.title}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mentor-availability">
                    <strong>Available on:</strong> {mentor.availability}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mentor-actions">
                <button
                  className="chat-btn"
                  onClick={() => handleChatWithMentor(mentor)}
                >
                  <MessageCircle size={18} /> Chat with Mentor
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-mentors">No mentors match your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FindingMentor;
