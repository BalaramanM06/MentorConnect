import React, { useState, useEffect, useRef } from "react";
import { Search, BookOpenCheck, FileText, Download, X, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import ChatRoom from "../Chat/ChatRoom";
import "./MentorStudents.css";

const MentorStudents = () => {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showResourcesPanel, setShowResourcesPanel] = useState(false);
    const [resources, setResources] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [resourceName, setResourceName] = useState("");
    const [resourceDescription, setResourceDescription] = useState("");
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user profile
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError("Authentication required. Please log in.");
                    navigate("/login");
                    return;
                }

                try {
                    const response = await api.get("/auth/profile");
                    if (response.data) {
                        setCurrentUser(response.data);
                        localStorage.setItem("userProfile", JSON.stringify(response.data));
                    } else {
                        throw new Error("Failed to load user profile");
                    }
                } catch (err) {
                    console.error("Error loading user profile from API:", err);

                    // Extract email from token
                    const email = extractEmailFromToken(token);

                    // Fallback: Create a basic user profile from token
                    const userProfile = {
                        email: email,
                        name: email.split('@')[0].replace('.', ' '),
                        role: 'MENTOR'
                    };

                    setCurrentUser(userProfile);
                    localStorage.setItem("userProfile", JSON.stringify(userProfile));
                }
            } catch (err) {
                console.error("Error loading user profile:", err);
                setError("Failed to load user profile. Please try again.");
            }
        };

        // Fetch enrolled students from the backend
        const fetchEnrolledStudents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');

                // Get all enrolled students from the actual backend endpoint
                const response = await api.get("/mentor/getAllCurrUser", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data) {
                    // Transform the data to match the expected format
                    const formattedStudents = response.data.map(student => ({
                        email: student.email || student.userEmail,
                        name: student.name || student.userName || student.email.split('@')[0].replace('.', ' '),
                        profilePic: student.profilePic || null,
                        courses: [
                            {
                                title: student.courseName || "Unknown Course",
                                status: "Active"
                            }
                        ]
                    }));

                    setEnrolledStudents(formattedStudents);
                    localStorage.setItem("enrolledStudents", JSON.stringify(formattedStudents));
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error("Error fetching enrolled students:", err);
                setError("Failed to load enrolled students. Using cached data if available.");

                // Fallback: Try to load from localStorage
                const cachedStudents = localStorage.getItem("enrolledStudents");
                if (cachedStudents) {
                    setEnrolledStudents(JSON.parse(cachedStudents));
                } else {
                    // Generate mock data if no cached data available
                    const mockStudents = generateMockStudents();
                    setEnrolledStudents(mockStudents);
                    localStorage.setItem("enrolledStudents", JSON.stringify(mockStudents));
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch resources
        const fetchResources = async () => {
            try {
                const response = await api.get("/api/mentor/resources");
                if (response.data) {
                    setResources(response.data);
                    localStorage.setItem("mentorResources", JSON.stringify(response.data));
                }
            } catch (err) {
                console.error("Error fetching resources:", err);

                // Fallback to localStorage
                const storedResources = JSON.parse(localStorage.getItem("mentorResources") || "[]");
                if (storedResources.length > 0) {
                    setResources(storedResources);
                } else {
                    // Generate mock resources
                    const mockResources = generateMockResources();
                    setResources(mockResources);
                    localStorage.setItem("mentorResources", JSON.stringify(mockResources));
                }
            }
        };

        // Execute fetches
        fetchUserProfile();
        fetchEnrolledStudents();
        fetchResources();
    }, [navigate]);

    // Extract email from JWT token
    const extractEmailFromToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            return payload.sub || 'mentor@example.com';
        } catch (error) {
            console.error("Error extracting email from token:", error);
            return 'mentor@example.com';
        }
    };

    // Generate mock students for fallback
    const generateMockStudents = () => {
        return [
            {
                email: "alice.johnson@example.com",
                name: "Alice Johnson",
                profilePic: null,
                courses: [
                    { title: "Web Development", status: "Active" }
                ]
            },
            {
                email: "bob.smith@example.com",
                name: "Bob Smith",
                profilePic: null,
                courses: [
                    { title: "Data Structures", status: "Active" }
                ]
            },
            {
                email: "charlie.davis@example.com",
                name: "Charlie Davis",
                profilePic: null,
                courses: [
                    { title: "Machine Learning", status: "Active" }
                ]
            }
        ];
    };

    // Generate mock resources for fallback
    const generateMockResources = () => {
        return [
            {
                id: "1",
                name: "JavaScript Fundamentals",
                description: "Core concepts of JavaScript programming",
                category: "Programming",
                url: "#",
                dateAdded: new Date().toISOString()
            },
            {
                id: "2",
                name: "React Cheat Sheet",
                description: "Quick reference for React hooks and patterns",
                category: "Web Development",
                url: "#",
                dateAdded: new Date().toISOString()
            },
            {
                id: "3",
                name: "Data Structures Guide",
                description: "Comprehensive guide to common data structures",
                category: "Computer Science",
                url: "#",
                dateAdded: new Date().toISOString()
            }
        ];
    };

    // Update filtered students when enrolled students or search term changes
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredStudents(enrolledStudents);
        } else {
            const filtered = enrolledStudents.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.courses.some(course =>
                    course.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredStudents(filtered);
        }
    }, [enrolledStudents, searchTerm]);

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setShowResourcesPanel(false);
    };

    const handleStartChat = (student) => {
        setSelectedStudent(student);
        setShowChat(true);
    };

    const handleBackFromChat = () => {
        setShowChat(false);
    };

    const handleResourceUpload = (e) => {
        e.preventDefault();
        // Simulate upload process
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);

                    // Add new resource to the list
                    const newResource = {
                        id: Date.now().toString(),
                        name: resourceName,
                        description: resourceDescription,
                        category: "Uploads",
                        url: URL.createObjectURL(selectedFile),
                        fileName: selectedFile.name,
                        dateAdded: new Date().toISOString()
                    };

                    const updatedResources = [newResource, ...resources];
                    setResources(updatedResources);
                    localStorage.setItem("mentorResources", JSON.stringify(updatedResources));

                    // Reset form
                    setResourceName("");
                    setResourceDescription("");
                    setSelectedFile(null);
                    setShowUploadForm(false);
                    return 0;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleDownloadResource = (resource) => {
        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = resource.url;
        a.download = resource.fileName || resource.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Helper function to get unique categories
    const getCategories = () => {
        const categories = new Set(resources.map(r => r.category));
        return ["All", ...categories];
    };

    // Filter resources by category
    const getFilteredResources = () => {
        if (selectedCategory === "All") return resources;
        return resources.filter(r => r.category === selectedCategory);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mentor-students-loading">
                <div className="spinner"></div>
                <p>Loading enrolled students...</p>
            </div>
        );
    }

    return (
        <div className="mentor-students-container">
            {error && (
                <div className="error-banner">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {showChat && selectedStudent ? (
                <ChatRoom
                    currentUser={currentUser}
                    initialSelectedMentor={selectedStudent}
                />
            ) : (
                <div className="students-content">
                    <div className="students-sidebar">
                        <div className="sidebar-header">
                            <h2>My Students</h2>
                            <div className="search-container">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search students or courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="student-list">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <div
                                        key={index}
                                        className={`student-item ${selectedStudent?.email === student.email ? "selected" : ""}`}
                                        onClick={() => handleStudentSelect(student)}
                                    >
                                        <div className="student-avatar">
                                            {student.profilePic ? (
                                                <img src={student.profilePic} alt={student.name} />
                                            ) : (
                                                <User size={24} />
                                            )}
                                        </div>
                                        <div className="student-info">
                                            <h3>{student.name}</h3>
                                            <p>{student.courses.map(c => c.title).join(", ")}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-students">
                                    <p>No students match your search</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="student-details">
                        {selectedStudent ? (
                            <div className="detail-container">
                                <div className="student-header">
                                    <div className="student-profile">
                                        <div className="profile-avatar">
                                            {selectedStudent.profilePic ? (
                                                <img src={selectedStudent.profilePic} alt={selectedStudent.name} />
                                            ) : (
                                                <User size={64} />
                                            )}
                                        </div>
                                        <div className="profile-info">
                                            <h2>{selectedStudent.name}</h2>
                                            <p>{selectedStudent.email}</p>
                                        </div>
                                    </div>
                                    <div className="student-actions">
                                        <button
                                            className="chat-button"
                                            onClick={() => handleStartChat(selectedStudent)}
                                        >
                                            Start Chat
                                        </button>
                                        <button
                                            className={`resources-button ${showResourcesPanel ? "active" : ""}`}
                                            onClick={() => setShowResourcesPanel(!showResourcesPanel)}
                                        >
                                            {showResourcesPanel ? "Hide Resources" : "Show Resources"}
                                        </button>
                                    </div>
                                </div>

                                <div className="enrollment-info">
                                    <h3>Enrolled Courses</h3>
                                    <div className="course-list">
                                        {selectedStudent.courses.map((course, index) => (
                                            <div key={index} className="course-item">
                                                <BookOpenCheck size={18} />
                                                <span>{course.title}</span>
                                                <span className={`status ${course.status.toLowerCase()}`}>
                                                    {course.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {showResourcesPanel && (
                                    <div className="resources-panel">
                                        <div className="resources-header">
                                            <h3>Learning Resources</h3>
                                            <button
                                                className="upload-button"
                                                onClick={() => setShowUploadForm(!showUploadForm)}
                                            >
                                                {showUploadForm ? "Cancel" : "Upload New"}
                                            </button>
                                        </div>

                                        {showUploadForm && (
                                            <div className="upload-form">
                                                <h4>Upload New Resource</h4>
                                                <form onSubmit={handleResourceUpload}>
                                                    <div className="form-group">
                                                        <label>Resource Name</label>
                                                        <input
                                                            type="text"
                                                            value={resourceName}
                                                            onChange={(e) => setResourceName(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Description</label>
                                                        <textarea
                                                            value={resourceDescription}
                                                            onChange={(e) => setResourceDescription(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>File</label>
                                                        <div className="file-input">
                                                            <input
                                                                type="file"
                                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                                                required
                                                            />
                                                            <div className="file-preview">
                                                                {selectedFile && (
                                                                    <div className="selected-file">
                                                                        <FileText size={16} />
                                                                        <span>{selectedFile.name}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setSelectedFile(null)}
                                                                        >
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {uploadProgress > 0 && (
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className="submit-button"
                                                        disabled={!selectedFile || !resourceName}
                                                    >
                                                        <Upload size={16} />
                                                        Upload Resource
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        <div className="category-filter">
                                            {getCategories().map((category, index) => (
                                                <button
                                                    key={index}
                                                    className={`category-button ${selectedCategory === category ? "active" : ""}`}
                                                    onClick={() => setSelectedCategory(category)}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="resources-list">
                                            {getFilteredResources().length > 0 ? (
                                                getFilteredResources().map((resource, index) => (
                                                    <div key={index} className="resource-item">
                                                        <div className="resource-info">
                                                            <FileText size={18} />
                                                            <div className="resource-details">
                                                                <h4>{resource.name}</h4>
                                                                <p>{resource.description}</p>
                                                                <span className="resource-meta">
                                                                    {new Date(resource.dateAdded).toLocaleDateString()} · {resource.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="download-button"
                                                            onClick={() => handleDownloadResource(resource)}
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-resources">
                                                    <p>No resources in this category</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-selection">
                                <User size={64} />
                                <h3>Select a student</h3>
                                <p>Choose a student from the list to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorStudents;
