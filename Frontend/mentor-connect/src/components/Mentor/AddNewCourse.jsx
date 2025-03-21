import React, { useState } from "react";
import "./AddNewCourse.css"; // Import your CSS file for styling

const AddNewCourse = () => {
    const [courseDetails, setCourseDetails] = useState({
        title: "",
        student: "",
        studentId: "",
        progress: 0,
        nextSession: "",
        totalSessions: 0,
        completedSessions: 0,
        category: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseDetails({
            ...courseDetails,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send courseDetails to your backend
        console.log("Course Details Submitted:", courseDetails);
        // Reset form after submission
        setCourseDetails({
            title: "",
            student: "",
            studentId: "",
            progress: 0,
            nextSession: "",
            totalSessions: 0,
            completedSessions: 0,
            category: ""
        });
    };

    return (
        <div className="add-course-container">
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Course Title:</label>
                    <input type="text" name="title" value={courseDetails.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Student Name:</label>
                    <input type="text" name="student" value={courseDetails.student} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Student ID:</label>
                    <input type="text" name="studentId" value={courseDetails.studentId} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Progress (%):</label>
                    <input type="number" name="progress" value={courseDetails.progress} onChange={handleChange} min="0" max="100" required />
                </div>
                <div className="form-group">
                    <label>Next Session Date:</label>
                    <input type="date" name="nextSession" value={courseDetails.nextSession} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Total Sessions:</label>
                    <input type="number" name="totalSessions" value={courseDetails.totalSessions} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Completed Sessions:</label>
                    <input type="number" name="completedSessions" value={courseDetails.completedSessions} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <input type="text" name="category" value={courseDetails.category} onChange={handleChange} required />
                </div>
                <button type="submit">Add Course</button>
            </form>
        </div>
    );
};

export default AddNewCourse;
