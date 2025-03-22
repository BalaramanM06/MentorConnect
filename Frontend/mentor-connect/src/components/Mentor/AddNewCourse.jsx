import React, { useState } from "react";
import api from "../../utils/axiosConfig";
import "./AddNewCourse.css";

const AddNewCourse = ({ email, onClose, refreshCourses }) => {
    const [newCourse, setNewCourse] = useState({
        courseName: "",
        description: "",
        certificate: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCourse((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setNewCourse((prev) => ({
            ...prev,
            certificate: e.target.files[0]
        }));
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Mentor email not found. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append("certificate", newCourse.certificate);
        formData.append("mentorName", email);
        formData.append("courseName", newCourse.courseName);
        formData.append("description", newCourse.description);

        try {
            await api.post("/mentor/validateCertificate", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Course added successfully!");
            refreshCourses(); // Reload courses after adding
            onClose(); // Close the form
        } catch (err) {
            console.error("Error adding course:", err);
            alert("Failed to add course.");
        }
    };

    return (
        <div className="add-course-overlay">
            <div className="add-course-container">
                <h3>Add a New Course</h3>
                <form onSubmit={handleAddCourse}>
                    <input type="text" name="courseName" placeholder="Course Name" value={newCourse.courseName} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" value={newCourse.description} onChange={handleChange} required />
                    <input type="file" name="certificate" onChange={handleFileChange} required />
                    <button type="submit">Add Course</button>
                    <button type="button" className="close-btn" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddNewCourse;
