import React, { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import "./MentorStudents.css";

const MentorStudents = () => {
    const [students, setStudents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get("/mentor/getAllStudent");
                if (response.data && response.data.newMentee) {
                    setStudents(response.data.newMentee); 
                } else {
                    setStudents([]);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                setError("Failed to fetch students. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) return <p>Loading students...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mentor-students-container">
            <h2>My Students</h2>
            {students.length > 0 ? (
                students.map((student, index) => (
                    <div key={index} className="student-card">
                        <h4>{student.user?.firstName} {student.user?.lastName}</h4>
                        <p>Email: {student.user?.email}</p>
                    </div>
                ))
            ) : (
                <p>No students assigned.</p>
            )}
        </div>
    );
};

export default MentorStudents;
