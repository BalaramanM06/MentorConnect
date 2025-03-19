import React, { useState, useEffect, useRef } from "react";
import { File, Upload, Trash2, Eye, Search, Download, Filter, FolderPlus, BookOpen } from "lucide-react";
import "./MentorResources.css";

const MentorResources = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCourse, setFilterCourse] = useState("all");
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [courses, setCourses] = useState([]);
    const [newResource, setNewResource] = useState({
        title: "",
        description: "",
        courseId: "",
        type: "document",
    });

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Load resources from localStorage
        const storedResources = JSON.parse(localStorage.getItem("mentorResources") || "[]");

        // Load courses
        const ongoingCourses = JSON.parse(localStorage.getItem("mentorOngoingCourses") || "[]");
        const courseSchedules = JSON.parse(localStorage.getItem("courseSchedules") || "[]");

        // Get course names from ongoing courses and accepted schedules
        const acceptedSchedules = courseSchedules.filter(schedule => schedule.status === "accepted");

        const allCourses = [];

        ongoingCourses.forEach(course => {
            allCourses.push({
                id: course.id.toString(),
                title: course.title,
                category: course.category,
            });
        });

        acceptedSchedules.forEach(schedule => {
            const existingCourse = allCourses.find(c => c.title === schedule.courseName);
            if (!existingCourse) {
                allCourses.push({
                    id: schedule.id.toString(),
                    title: schedule.courseName,
                });
            }
        });

        setCourses(allCourses);

        // If no resources in storage, create sample data
        if (storedResources.length === 0) {
            const sampleResources = [
                {
                    id: 1,
                    title: "Introduction to HTML and CSS",
                    description: "Basics of HTML structure and CSS styling",
                    fileType: "pdf",
                    fileUrl: "https://example.com/intro-html-css.pdf",
                    fileSize: "2.4 MB",
                    uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                    courseId: "1",
                    courseTitle: "Web Development Fundamentals",
                    downloadCount: 35,
                    type: "document"
                },
                {
                    id: 2,
                    title: "JavaScript Fundamentals",
                    description: "Core concepts of JavaScript programming",
                    fileType: "pdf",
                    fileUrl: "https://example.com/javascript-fundamentals.pdf",
                    fileSize: "3.1 MB",
                    uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    courseId: "1",
                    courseTitle: "Web Development Fundamentals",
                    downloadCount: 28,
                    type: "document"
                },
                {
                    id: 3,
                    title: "Python Data Structures",
                    description: "Overview of lists, dictionaries, and tuples in Python",
                    fileType: "pdf",
                    fileUrl: "https://example.com/python-data-structures.pdf",
                    fileSize: "1.8 MB",
                    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    courseId: "2",
                    courseTitle: "Data Science Essentials",
                    downloadCount: 42,
                    type: "document"
                },
                {
                    id: 4,
                    title: "Setup React Development Environment",
                    description: "Video tutorial on setting up React with npm and webpack",
                    fileType: "mp4",
                    fileUrl: "https://example.com/react-setup.mp4",
                    fileSize: "45.2 MB",
                    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    courseId: "1",
                    courseTitle: "Web Development Fundamentals",
                    downloadCount: 18,
                    type: "video"
                },
                {
                    id: 5,
                    title: "Mobile App Wireframes",
                    description: "Sample wireframes for mobile app projects",
                    fileType: "zip",
                    fileUrl: "https://example.com/mobile-wireframes.zip",
                    fileSize: "8.7 MB",
                    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    courseId: "3",
                    courseTitle: "Mobile App Development",
                    downloadCount: 15,
                    type: "resource"
                }
            ];

            setResources(sampleResources);
            localStorage.setItem("mentorResources", JSON.stringify(sampleResources));
        } else {
            setResources(storedResources);
        }
    }, []);

    useEffect(() => {
        // Apply filters and search
        let filtered = [...resources];

        // Apply type filter
        if (filterType !== "all") {
            filtered = filtered.filter(resource => resource.type === filterType);
        }

        // Apply course filter
        if (filterCourse !== "all") {
            filtered = filtered.filter(resource => resource.courseId === filterCourse);
        }

        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(resource =>
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by most recent uploads
        filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        setFilteredResources(filtered);
    }, [resources, searchTerm, filterType, filterCourse]);

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case "pdf":
                return <File size={24} color="#F44336" />;
            case "ppt":
            case "pptx":
                return <File size={24} color="#FF9800" />;
            case "doc":
            case "docx":
                return <File size={24} color="#2196F3" />;
            case "xls":
            case "xlsx":
                return <File size={24} color="#4CAF50" />;
            case "mp4":
            case "mov":
            case "avi":
                return <File size={24} color="#9C27B0" />;
            case "jpg":
            case "png":
            case "gif":
                return <File size={24} color="#00BCD4" />;
            case "zip":
            case "rar":
                return <File size={24} color="#607D8B" />;
            default:
                return <File size={24} color="#9E9E9E" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Extract file extension
            const fileType = file.name.split(".").pop().toLowerCase();

            setNewResource({
                ...newResource,
                fileType,
                fileSize: formatFileSize(file.size)
            });
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (!selectedFile || !newResource.title || !newResource.courseId) {
            alert("Please fill in all required fields and select a file");
            return;
        }

        // Simulate file upload
        setIsUploading(true);
        let progress = 0;

        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);

                // Create new resource
                const selectedCourse = courses.find(course => course.id === newResource.courseId);

                const resource = {
                    id: Date.now(),
                    title: newResource.title,
                    description: newResource.description || "No description",
                    fileType: newResource.fileType,
                    fileUrl: URL.createObjectURL(selectedFile), // For demo purposes
                    fileSize: newResource.fileSize,
                    uploadDate: new Date().toISOString(),
                    courseId: newResource.courseId,
                    courseTitle: selectedCourse ? selectedCourse.title : "Unknown Course",
                    downloadCount: 0,
                    type: newResource.type
                };

                const updatedResources = [...resources, resource];
                setResources(updatedResources);
                localStorage.setItem("mentorResources", JSON.stringify(updatedResources));

                // Reset form
                setIsUploading(false);
                setUploadProgress(0);
                setSelectedFile(null);
                setNewResource({
                    title: "",
                    description: "",
                    courseId: "",
                    type: "document"
                });
                setShowFileUpload(false);
            }
        }, 300);
    };

    const handleDeleteResource = (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            const updatedResources = resources.filter(resource => resource.id !== id);
            setResources(updatedResources);
            localStorage.setItem("mentorResources", JSON.stringify(updatedResources));
        }
    };

    const handleViewResource = (resource) => {
        window.open(resource.fileUrl, "_blank");
    };

    const handleDownloadResource = (resource) => {
        // In a real app, this would download the file
        // For this demo, we'll just increment the download count

        const updatedResources = resources.map(r => {
            if (r.id === resource.id) {
                return { ...r, downloadCount: r.downloadCount + 1 };
            }
            return r;
        });

        setResources(updatedResources);
        localStorage.setItem("mentorResources", JSON.stringify(updatedResources));

        // Open the URL in a new tab to simulate download
        window.open(resource.fileUrl, "_blank");
    };

    return (
        <div className="mentor-resources-container">
            <div className="resources-header">
                <div className="header-left">
                    <h2>Resources</h2>
                    <p className="subtitle">Upload and manage your course materials</p>
                </div>

                <button
                    className="upload-btn"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                >
                    <Upload size={18} />
                    Upload New Resource
                </button>
            </div>

            {showFileUpload && (
                <div className="upload-container">
                    <div className="upload-header">
                        <h3>Upload New Resource</h3>
                        <button
                            className="close-upload-btn"
                            onClick={() => setShowFileUpload(false)}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    <form className="upload-form" onSubmit={handleUpload}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={newResource.title}
                                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                    placeholder="Resource title"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Course *</label>
                                <select
                                    value={newResource.courseId}
                                    onChange={(e) => setNewResource({ ...newResource, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={newResource.type}
                                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                                >
                                    <option value="document">Document</option>
                                    <option value="video">Video</option>
                                    <option value="assignment">Assignment</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>File *</label>
                                <div className="file-input-container">
                                    <button
                                        type="button"
                                        className="file-select-btn"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Upload size={16} />
                                        {selectedFile ? 'Change file' : 'Select file'}
                                    </button>
                                    <span className="selected-file-name">
                                        {selectedFile ? selectedFile.name : 'No file selected'}
                                    </span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newResource.description}
                                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                placeholder="Describe this resource"
                                rows={3}
                            ></textarea>
                        </div>

                        {isUploading && (
                            <div className="upload-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <span>{uploadProgress}%</span>
                            </div>
                        )}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setShowFileUpload(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isUploading || !selectedFile}
                            >
                                {isUploading ? 'Uploading...' : 'Upload Resource'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="resources-filters">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-container">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="document">Documents</option>
                            <option value="video">Videos</option>
                            <option value="assignment">Assignments</option>
                            <option value="resource">Resources</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <BookOpen size={16} />
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                        >
                            <option value="all">All Courses</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="resources-list">
                {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                        <div key={resource.id} className="resource-card">
                            <div className="resource-icon">
                                {getFileIcon(resource.fileType)}
                            </div>

                            <div className="resource-info">
                                <h4>{resource.title}</h4>
                                <div className="resource-meta">
                                    <span className="resource-course">{resource.courseTitle}</span>
                                    <span className="resource-dot">•</span>
                                    <span className="resource-type">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                                    <span className="resource-dot">•</span>
                                    <span className="resource-date">Uploaded: {formatDate(resource.uploadDate)}</span>
                                </div>
                                <p className="resource-description">{resource.description}</p>
                                <div className="resource-details">
                                    <span className="resource-file-details">
                                        {resource.fileType.toUpperCase()} • {resource.fileSize}
                                    </span>
                                    <span className="resource-downloads">
                                        {resource.downloadCount} downloads
                                    </span>
                                </div>
                            </div>

                            <div className="resource-actions">
                                <button
                                    className="view-btn"
                                    onClick={() => handleViewResource(resource)}
                                    title="View"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    className="download-btn"
                                    onClick={() => handleDownloadResource(resource)}
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteResource(resource.id)}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-resources">
                        <FolderPlus size={48} />
                        <h3>No resources found</h3>
                        {searchTerm || filterType !== "all" || filterCourse !== "all" ? (
                            <p>No resources match your search criteria. Try different filters.</p>
                        ) : (
                            <p>You haven't uploaded any resources yet. Click "Upload New Resource" to get started.</p>
                        )}
                        {!showFileUpload && (
                            <button
                                className="upload-now-btn"
                                onClick={() => setShowFileUpload(true)}
                            >
                                <Upload size={18} />
                                Upload Now
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorResources; 