import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Plus } from "lucide-react";
import api from "../../utils/axiosConfig";
import "./Courses.css";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: "", description: "", certificate: null });
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDropDownClicked, setIsDropDownClicked] = useState(false);
    const navigate = useNavigate();  

    useEffect(() => {
        fetchMentorDetails();
    }, []);

    const fetchMentorDetails = async () => {
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("Authentication token missing. Please log in.");
            setLoading(false);
            navigate("/login");
            return;
        }

        try {
            const response = await api.get("/auth/profile");
            if (response.data?.email) {
                setEmail(response.data.email);
                setCourses(response.data.courses || []);
            } else {
                setError("Failed to fetch mentor details.");
            }
        } catch (err) {
            console.error("Error fetching mentor details:", err);
            setError("Failed to fetch mentor details.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const toggleDropDown = () => {
        setIsDropDownClicked((prev) => !prev);
    };

    const handleFileChange = (e) => {
        setNewCourse({ ...newCourse, certificate: e.target.files[0] });
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!email) {
            alert("Mentor email not found. Please log in again.");
            return;
        }

        const formData = new FormData();
        if (newCourse.certificate) formData.append("certificate", newCourse.certificate);
        formData.append("mentorName", email);
        formData.append("courseName", newCourse.courseName);
        formData.append("description", newCourse.description);

        try {
            await api.post("/mentor/validateCertificate", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Course added successfully!");
            setCourses([...courses, { ...newCourse }]); 
            setNewCourse({ courseName: "", description: "", certificate: null });
            setIsDropDownClicked(false);
        } catch (err) {
            console.error("Error adding course:", err);
            setError("Failed to add course.");
        }
    };

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="courses-container">
            <div className="course-heading">
                <h2>My Courses</h2>
                <div className="add-course-form">
                    <button className="add-course-btn" onClick={toggleDropDown}>
                        <Plus size={16} /> Add Course
                    </button>
                    {isDropDownClicked && (
                        <div className="dropdown-content">
                            <form onSubmit={handleAddCourse}>
                                <input type="text" name="courseName" placeholder="Course Name" value={newCourse.courseName} onChange={handleChange} required />
                                <input type="text" name="description" placeholder="Description" value={newCourse.description} onChange={handleChange} required />
                                <input type="file" name="certificate" onChange={handleFileChange} required />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="course-list">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div key={index} className="course-card">
                            <h3>{course.courseName || "No Title"}</h3>
                            <p>{course.description || "No Description"}</p>
                        </div>
                    ))
                ) : (
                    <p>No courses found.</p>
                )}
            </div>
        </div>
    );
};

export default Courses;