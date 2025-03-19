import React, { useState, useEffect, useRef } from "react";
import { Search, Send, ArrowLeft, Clock, User, MoreVertical, Paperclip, BookOpenCheck, FileText, Download, X, Upload } from "lucide-react";
import "./MentorStudents.css";

const MentorStudents = () => {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const messagesEndRef = useRef(null);
    const [showResourcesPanel, setShowResourcesPanel] = useState(false);
    const [resources, setResources] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [resourceName, setResourceName] = useState("");
    const [resourceDescription, setResourceDescription] = useState("");
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        // Load enrolled students and their courses from localStorage
        // In a real app, this would come from an API
        const ongoingCourses = JSON.parse(localStorage.getItem("mentorOngoingCourses") || "[]");
        const courseSchedules = JSON.parse(localStorage.getItem("courseSchedules") || "[]");

        // Get all accepted students from ongoing courses and scheduled courses
        const acceptedSchedules = courseSchedules.filter(schedule => schedule.status === "accepted");

        // Create a list of enrolled students with their courses
        const students = [];

        // Add students from ongoing courses
        ongoingCourses.forEach(course => {
            const existingStudent = students.find(s => s.id === course.studentId);
            if (existingStudent) {
                existingStudent.courses.push({
                    id: course.id,
                    title: course.title,
                    category: course.category,
                });
            } else {
                students.push({
                    id: course.studentId,
                    name: course.student,
                    status: "online",
                    profilePic: null,
                    lastSeen: "Just now",
                    courses: [{
                        id: course.id,
                        title: course.title,
                        category: course.category,
                    }]
                });
            }
        });

        // Add students from accepted schedules
        acceptedSchedules.forEach(schedule => {
            const existingStudent = students.find(s => s.id === schedule.studentId);
            if (!existingStudent) {
                students.push({
                    id: schedule.studentId,
                    name: schedule.studentName,
                    status: Math.random() > 0.5 ? "online" : "offline",
                    profilePic: null,
                    lastSeen: Math.random() > 0.5 ? "2h ago" : "Today",
                    courses: [{
                        id: schedule.id,
                        title: schedule.courseName,
                    }]
                });
            }
        });

        // If there are no enrolled students, add some dummy data for demonstration
        if (students.length === 0) {
            const dummyStudents = [
                {
                    id: "STU12345",
                    name: "Alex Johnson",
                    status: "online",
                    profilePic: null,
                    lastSeen: "Just now",
                    courses: [
                        { id: 1, title: "Web Development Fundamentals", category: "Web Development" }
                    ],
                    unreadCount: 3
                },
                {
                    id: "STU67890",
                    name: "Emily Chen",
                    status: "offline",
                    profilePic: null,
                    lastSeen: "2h ago",
                    courses: [
                        { id: 2, title: "Data Science Essentials", category: "Data Science" }
                    ],
                    unreadCount: 0
                },
                {
                    id: "STU24680",
                    name: "Michael Smith",
                    status: "online",
                    profilePic: null,
                    lastSeen: "Just now",
                    courses: [
                        { id: 3, title: "Mobile App Development", category: "Mobile Development" }
                    ],
                    unreadCount: 1
                }
            ];
            setEnrolledStudents(dummyStudents);
        } else {
            setEnrolledStudents(students);
        }

        // Load resources
        const storedResources = JSON.parse(localStorage.getItem("mentorResources") || "[]");
        if (storedResources.length === 0) {
            // Sample resources for demonstration
            const dummyResources = [
                {
                    id: 1,
                    name: "JavaScript Basics Cheatsheet",
                    description: "A comprehensive cheatsheet covering JavaScript fundamentals",
                    category: "Web Development",
                    fileType: "PDF",
                    fileSize: "1.2 MB",
                    uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    downloads: 24
                },
                {
                    id: 2,
                    name: "Data Visualization with Python",
                    description: "Guide to creating effective data visualizations using Matplotlib and Seaborn",
                    category: "Data Science",
                    fileType: "PDF",
                    fileSize: "3.4 MB",
                    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    downloads: 17
                },
                {
                    id: 3,
                    name: "Mobile UI Design Principles",
                    description: "Best practices for creating intuitive mobile application interfaces",
                    category: "Mobile Development",
                    fileType: "PDF",
                    fileSize: "2.7 MB",
                    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    downloads: 31
                }
            ];
            setResources(dummyResources);
            localStorage.setItem("mentorResources", JSON.stringify(dummyResources));
        } else {
            setResources(storedResources);
        }

    }, []);

    useEffect(() => {
        // Filter students based on search term
        const filtered = enrolledStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.courses.some(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStudents(filtered);
    }, [searchTerm, enrolledStudents]);

    useEffect(() => {
        // Load messages for selected student
        if (selectedStudent) {
            // Check if there are stored messages for this student
            const storedMessages = JSON.parse(localStorage.getItem(`messages_${selectedStudent.id}`) || "[]");

            if (storedMessages.length === 0) {
                // Generate dummy messages if none exist
                const dummyMessages = generateDummyMessages(selectedStudent);
                setMessages(dummyMessages);
                localStorage.setItem(`messages_${selectedStudent.id}`, JSON.stringify(dummyMessages));
            } else {
                setMessages(storedMessages);
            }

            // Mark messages as read
            const updatedStudents = enrolledStudents.map(student => {
                if (student.id === selectedStudent.id) {
                    return { ...student, unreadCount: 0 };
                }
                return student;
            });
            setEnrolledStudents(updatedStudents);
        }
    }, [selectedStudent]);

    useEffect(() => {
        // Scroll to bottom of messages when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const generateDummyMessages = (student) => {
        const courseTitles = student.courses.map(course => course.title);

        return [
            {
                id: 1,
                sender: "student",
                content: `Hello! I'm interested in the ${courseTitles[0]} course.`,
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
            },
            {
                id: 2,
                sender: "mentor",
                content: `Hi ${student.name}! I'd be happy to help you with the ${courseTitles[0]} course. What specific aspects are you interested in?`,
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString() // 30 minutes after previous message
            },
            {
                id: 3,
                sender: "student",
                content: "I'm particularly interested in the practical projects and how they relate to real-world applications.",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
            },
            {
                id: 4,
                sender: "mentor",
                content: "That's great! In this course, we'll be working on several projects that simulate real-world scenarios. We'll start with a simple project and gradually move to more complex ones.",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString() // 45 minutes after previous message
            },
            {
                id: 5,
                sender: "student",
                content: "Sounds perfect! When can we start?",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
        ];
    };

    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setShowResourcesPanel(false);
    };

    const handleBackToList = () => {
        setSelectedStudent(null);
        setShowResourcesPanel(false);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: "mentor",
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);

        // Save to localStorage
        localStorage.setItem(`messages_${selectedStudent.id}`, JSON.stringify(updatedMessages));

        // Clear input field
        setNewMessage("");
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const toggleResourcesPanel = () => {
        setShowResourcesPanel(!showResourcesPanel);
    };

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadResource = (e) => {
        e.preventDefault();

        if (!selectedFile || !resourceName) return;

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        // After "upload" is complete, add the resource
        setTimeout(() => {
            const newResource = {
                id: Date.now(),
                name: resourceName,
                description: resourceDescription,
                category: selectedStudent.courses[0].category || "General",
                fileType: selectedFile.name.split('.').pop().toUpperCase(),
                fileSize: formatFileSize(selectedFile.size),
                uploadDate: new Date().toISOString(),
                downloads: 0
            };

            const updatedResources = [newResource, ...resources];
            setResources(updatedResources);
            localStorage.setItem("mentorResources", JSON.stringify(updatedResources));

            // Reset form
            setResourceName("");
            setResourceDescription("");
            setSelectedFile(null);
            setUploadProgress(0);
            setShowUploadForm(false);

            // Share resource with student in chat
            handleShareResource(newResource);
        }, 2500);
    };

    const handleShareResource = (resource) => {
        if (!selectedStudent) return;

        const newMsg = {
            id: Date.now(),
            sender: "mentor",
            content: `I've shared a resource with you: ${resource.name}`,
            isResource: true,
            resource: resource,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        localStorage.setItem(`messages_${selectedStudent.id}`, JSON.stringify(updatedMessages));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && selectedStudent) {
            // Create message with file
            const newMsg = {
                id: Date.now(),
                sender: "mentor",
                content: `📎 File: ${file.name}`,
                isFile: true,
                filename: file.name,
                filesize: formatFileSize(file.size),
                timestamp: new Date().toISOString()
            };

            const updatedMessages = [...messages, newMsg];
            setMessages(updatedMessages);
            localStorage.setItem(`messages_${selectedStudent.id}`, JSON.stringify(updatedMessages));
        }
    };

    const filteredResources = selectedCategory === "All"
        ? resources
        : resources.filter(resource => resource.category === selectedCategory);

    return (
        <div className="mentor-messages-container">
            {!selectedStudent ? (
                <>
                    <div className="messages-header">
                        <h2>Messages</h2>
                        <p className="subtitle">Chat with your enrolled students</p>
                        <div className="search-bar">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search students or courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="student-list">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="student-item"
                                    onClick={() => handleStudentSelect(student)}
                                >
                                    <div className="student-avatar">
                                        {student.profilePic ? (
                                            <img src={student.profilePic} alt={student.name} />
                                        ) : (
                                            <div className="default-avatar">
                                                <User size={24} />
                                            </div>
                                        )}
                                        <span className={`status-indicator ${student.status}`}></span>
                                    </div>

                                    <div className="student-info">
                                        <div className="student-header">
                                            <h4>{student.name}</h4>
                                            <span className="timestamp">{student.lastSeen}</span>
                                        </div>
                                        <p className="course-name">{student.courses.map(course => course.title).join(", ")}</p>
                                    </div>

                                    {student.unreadCount > 0 && (
                                        <span className="unread-count">{student.unreadCount}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="no-students">
                                <User size={48} />
                                <h3>No students found</h3>
                                {searchTerm ? (
                                    <p>No students match your search criteria.</p>
                                ) : (
                                    <p>You don't have any enrolled students yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="chat-container">
                    <div className="chat-header">
                        <div className="header-left">
                            <button className="back-btn" onClick={handleBackToList}>
                                <ArrowLeft size={20} />
                            </button>

                            <div className="student-avatar">
                                {selectedStudent.profilePic ? (
                                    <img src={selectedStudent.profilePic} alt={selectedStudent.name} />
                                ) : (
                                    <div className="default-avatar">
                                        <User size={24} />
                                    </div>
                                )}
                                <span className={`status-indicator ${selectedStudent.status}`}></span>
                            </div>

                            <div className="student-chat-info">
                                <h3>{selectedStudent.name}</h3>
                                <p>{selectedStudent.status === "online" ? "Online" : `Last seen: ${selectedStudent.lastSeen}`}</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="header-action-btn" title="View Documents">
                                <FileText size={22} />
                            </button>
                            <button className="more-options">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={`chat-body ${showResourcesPanel ? 'with-sidebar' : ''}`}>
                        <div className="chat-messages">
                            <div className="course-info-banner">
                                <p>
                                    <strong>Current courses:</strong> {selectedStudent.courses.map(course => course.title).join(", ")}
                                </p>
                            </div>

                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`message ${message.sender === "mentor" ? "sent" : "received"}`}
                                >
                                    {message.isResource ? (
                                        <div className="resource-message">
                                            <BookOpenCheck size={18} />
                                            <div className="resource-details">
                                                <span className="resource-name">{message.resource.name}</span>
                                                <span className="resource-size">{message.resource.fileSize} • {message.resource.fileType}</span>
                                            </div>
                                        </div>
                                    ) : message.isFile ? (
                                        <div className="file-message">
                                            <Paperclip size={18} />
                                            <div className="file-details">
                                                <span className="file-name">{message.filename}</span>
                                                <span className="file-size">{message.filesize}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="message-content">{message.content}</div>
                                    )}
                                    <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {showResourcesPanel && (
                            <div className="resources-sidebar">
                                <div className="resources-sidebar-header">
                                    <h3>Resources</h3>
                                    <button className="close-resources-btn" onClick={toggleResourcesPanel}>
                                        <X size={18} />
                                    </button>
                                </div>

                                {showUploadForm ? (
                                    <div className="upload-container">
                                        <div className="upload-header">
                                            <h3>Upload New Resource</h3>
                                            <button className="close-upload-btn" onClick={() => setShowUploadForm(false)}>
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <form className="upload-form" onSubmit={handleUploadResource}>
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
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>File</label>
                                                <div className="file-input-container">
                                                    <label className="file-select-btn">
                                                        <Paperclip size={16} />
                                                        Browse Files
                                                        <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                                                    </label>
                                                    <span className="selected-file-name">
                                                        {selectedFile ? selectedFile.name : "No file selected"}
                                                    </span>
                                                </div>
                                            </div>

                                            {uploadProgress > 0 && (
                                                <div className="upload-progress">
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                                                    </div>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                            )}

                                            <div className="form-actions">
                                                <button type="button" className="cancel-btn" onClick={() => setShowUploadForm(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="submit-btn" disabled={!selectedFile || !resourceName}>
                                                    Upload & Share
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <>
                                        <button className="upload-btn" onClick={() => setShowUploadForm(true)}>
                                            <Upload size={18} /> Upload New Resource
                                        </button>

                                        <div className="resources-filter">
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="category-select"
                                            >
                                                <option value="All">All Categories</option>
                                                <option value="Web Development">Web Development</option>
                                                <option value="Data Science">Data Science</option>
                                                <option value="Mobile Development">Mobile Development</option>
                                                <option value="General">General</option>
                                            </select>
                                        </div>

                                        <div className="resources-list">
                                            {filteredResources.length > 0 ? (
                                                filteredResources.map(resource => (
                                                    <div key={resource.id} className="resource-item">
                                                        <div className="resource-icon">
                                                            <FileText size={22} />
                                                        </div>
                                                        <div className="resource-info">
                                                            <h4>{resource.name}</h4>
                                                            <p className="resource-meta">{resource.fileType} • {resource.fileSize}</p>
                                                            {resource.description && <p className="resource-description">{resource.description}</p>}
                                                        </div>
                                                        <div className="resource-actions">
                                                            <button
                                                                className="share-resource-btn"
                                                                onClick={() => handleShareResource(resource)}
                                                                title="Share with student"
                                                            >
                                                                Share
                                                            </button>
                                                            <button className="download-btn" title="Download">
                                                                <Download size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-resources">
                                                    <p>No resources in this category</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <form className="message-input" onSubmit={handleSendMessage}>
                        <label className="file-upload" title="Attach File">
                            <Paperclip size={24} />
                            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>

                        <button
                            type="button"
                            className="resources-btn"
                            onClick={toggleResourcesPanel}
                            title="Resources"
                        >
                            <BookOpenCheck size={24} />
                        </button>

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
                        />

                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!newMessage.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MentorStudents;
