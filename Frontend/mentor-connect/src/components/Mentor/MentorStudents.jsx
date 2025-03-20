import React, { useState, useEffect } from "react";
import { Search, BookOpenCheck, FileText, Download, X, Upload, User, ArrowLeft } from "lucide-react";
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

        // Fetch enrolled students
        const fetchEnrolledStudents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');

                const response = await api.get("/mentor/getAllCurrUser", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data) {
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
        setShowChat(false);
    };

    const handleStartChat = (student) => {
        setSelectedStudent(student);
        setShowChat(true);
        setShowResourcesPanel(false);
    };

    const handleBackFromChat = () => {
        setShowChat(false);
    };

    const handleResourceUpload = (e) => {
        e.preventDefault();
        if (!selectedFile || !resourceName.trim()) return;

        // Mock upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    // Create new resource
                    const newResource = {
                        id: Date.now().toString(),
                        name: resourceName,
                        description: resourceDescription,
                        category: resourceDescription.includes("Web") ? "Web Development" :
                            resourceDescription.includes("Data") ? "Data Science" : "Programming",
                        url: URL.createObjectURL(selectedFile),
                        dateAdded: new Date().toISOString(),
                        fileName: selectedFile.name
                    };

                    // Add to resources
                    const updatedResources = [...resources, newResource];
                    setResources(updatedResources);
                    localStorage.setItem("mentorResources", JSON.stringify(updatedResources));

                    // Reset form
                    setResourceName("");
                    setResourceDescription("");
                    setSelectedFile(null);
                    setUploadProgress(0);
                    setShowUploadForm(false);
                }, 500);
            }
        }, 300);
    };

    const handleDownloadResource = (resource) => {
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = resource.url;
        link.download = resource.fileName || resource.name + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getCategories = () => {
        const categories = Array.from(new Set(resources.map(r => r.category)));
        return ["All", ...categories];
    };

    const getFilteredResources = () => {
        if (selectedCategory === "All") return resources;
        return resources.filter(r => r.category === selectedCategory);
    };

    // If loading
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading students...</p>
            </div>
        );
    }

    // If error and no students
    if (error && !filteredStudents.length) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    // Render chat if selected
    if (showChat && selectedStudent) {
        return (
            <div className="chat-container">
                <div className="chat-header">
                    <button className="back-button" onClick={handleBackFromChat}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="chat-header-info">
                        <h3>{selectedStudent.name}</h3>
                        <p>{selectedStudent.courses[0]?.title || 'No course'}</p>
                    </div>
                </div>
                <ChatRoom
                    recipient={selectedStudent}
                    currentUser={currentUser}
                />
            </div>
        );
    }

    return (
        <div className="mentor-students-container">
            <div className="students-header">
                <div className="search-container">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search students or courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="students-list-container">
                <div className="students-list">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div
                                key={student.email}
                                className={`student-card ${selectedStudent && selectedStudent.email === student.email ? 'selected' : ''}`}
                                onClick={() => handleStudentSelect(student)}
                            >
                                <div className="student-avatar">
                                    {student.profilePic ? (
                                        <img src={student.profilePic} alt={student.name} />
                                    ) : (
                                        <User className="fallback-avatar" size={24} />
                                    )}
                                </div>
                                <div className="student-info">
                                    <h4 className="student-name">{student.name}</h4>
                                    <p className="student-course">{student.courses[0]?.title || 'No course'}</p>
                                </div>
                                <div className="student-actions">
                                    <button
                                        className="student-action-btn chat"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartChat(student);
                                        }}
                                    >
                                        <BookOpenCheck size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <User size={40} />
                            <p>No students found</p>
                        </div>
                    )}
                </div>

                {selectedStudent && !showResourcesPanel && (
                    <div className="student-detail">
                        <div className="detail-header">
                            <div className="detail-avatar">
                                {selectedStudent.profilePic ? (
                                    <img src={selectedStudent.profilePic} alt={selectedStudent.name} />
                                ) : (
                                    <User size={30} />
                                )}
                            </div>
                            <div className="detail-info">
                                <h3>{selectedStudent.name}</h3>
                                <p>{selectedStudent.email}</p>
                            </div>
                            <div className="detail-actions">
                                <button
                                    className="detail-btn primary"
                                    onClick={() => handleStartChat(selectedStudent)}
                                >
                                    <BookOpenCheck size={18} /> Start Session
                                </button>
                                <button
                                    className="detail-btn secondary"
                                    onClick={() => setShowResourcesPanel(true)}
                                >
                                    <FileText size={18} /> Resources
                                </button>
                            </div>
                        </div>
                        <div className="detail-content">
                            <div className="detail-section">
                                <h4><BookOpenCheck size={18} /> Enrolled Courses</h4>
                                {selectedStudent.courses.map((course, index) => (
                                    <div className="resource-card" key={index}>
                                        <div className="resource-icon">
                                            <BookOpenCheck size={20} />
                                        </div>
                                        <div className="resource-info">
                                            <h5 className="resource-title">{course.title}</h5>
                                            <p className="resource-description">Status: {course.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="detail-section">
                                <h4><FileText size={18} /> Shared Resources</h4>
                                {getFilteredResources().slice(0, 3).map((resource) => (
                                    <div className="resource-card" key={resource.id}>
                                        <div className="resource-icon">
                                            <FileText size={20} />
                                        </div>
                                        <div className="resource-info">
                                            <h5 className="resource-title">{resource.name}</h5>
                                            <p className="resource-description">{resource.description}</p>
                                        </div>
                                        <div className="resource-action">
                                            <button
                                                className="download-btn"
                                                onClick={() => handleDownloadResource(resource)}
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <button
                                        className="detail-btn secondary"
                                        onClick={() => setShowResourcesPanel(true)}
                                    >
                                        View All Resources
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showResourcesPanel && (
                    <div className="resources-panel">
                        <div className="panel-header">
                            <h3>Learning Resources</h3>
                            <div className="panel-actions">
                                <select
                                    className="filter-dropdown"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {getCategories().map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <button
                                    className="detail-btn secondary"
                                    onClick={() => setShowResourcesPanel(false)}
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button
                                    className="detail-btn primary"
                                    onClick={() => setShowUploadForm(!showUploadForm)}
                                >
                                    <Upload size={18} /> {showUploadForm ? 'Cancel' : 'Upload'}
                                </button>
                            </div>
                        </div>
                        <div className="panel-content">
                            {showUploadForm && (
                                <div className="upload-form">
                                    <form onSubmit={handleResourceUpload}>
                                        <div className="form-group">
                                            <label>Resource Name</label>
                                            <input
                                                type="text"
                                                value={resourceName}
                                                onChange={(e) => setResourceName(e.target.value)}
                                                placeholder="Enter resource name"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={resourceDescription}
                                                onChange={(e) => setResourceDescription(e.target.value)}
                                                placeholder="Enter resource description"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="file-upload">Resource File</label>
                                            <div
                                                className="file-input-container"
                                                onClick={() => document.getElementById('file-upload').click()}
                                            >
                                                <Upload size={30} />
                                                <p>{selectedFile ? selectedFile.name : 'Click to upload file'}</p>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                                />
                                            </div>
                                        </div>
                                        {uploadProgress > 0 && (
                                            <div className="progress-container">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${uploadProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="detail-btn secondary"
                                                onClick={() => {
                                                    setShowUploadForm(false);
                                                    setResourceName("");
                                                    setResourceDescription("");
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="detail-btn primary"
                                                disabled={!selectedFile || !resourceName.trim()}
                                            >
                                                Upload Resource
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {getFilteredResources().length > 0 ? (
                                getFilteredResources().map((resource) => (
                                    <div className="resource-card" key={resource.id}>
                                        <div className="resource-icon">
                                            <FileText size={20} />
                                        </div>
                                        <div className="resource-info">
                                            <h5 className="resource-title">{resource.name}</h5>
                                            <p className="resource-description">
                                                {resource.description} • {resource.category}
                                            </p>
                                        </div>
                                        <div className="resource-action">
                                            <button
                                                className="download-btn"
                                                onClick={() => handleDownloadResource(resource)}
                                            >
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <FileText size={40} />
                                    <p>No resources found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorStudents;
