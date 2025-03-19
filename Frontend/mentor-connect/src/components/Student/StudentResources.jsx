import React, { useState, useEffect } from "react";
import {
    FileText,
    Video,
    Image,
    File,
    Download,
    ChevronRight,
    Link as LinkIcon,
    Search,
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./StudentResources.css";
import defaultAvatar from "../../assets/default-profile.jpeg";

const StudentResources = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [resources, setResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [resourceType, setResourceType] = useState("all");

    // Sample mentors data
    useEffect(() => {
        const sampleMentors = [
            {
                id: 1,
                name: "Dr. Emily Carter",
                course: "Data Science with Python",
                avatar: defaultAvatar
            },
            {
                id: 2,
                name: "Prof. John Smith",
                course: "Cybersecurity Fundamentals",
                avatar: defaultAvatar
            },
            {
                id: 3,
                name: "Dr. Susan Lee",
                course: "Artificial Intelligence",
                avatar: defaultAvatar
            },
            {
                id: 4,
                name: "Dr. Mark Johnson",
                course: "Cloud Systems Architecture",
                avatar: defaultAvatar
            }
        ];
        setMentors(sampleMentors);
    }, []);

    // Sample resources data when a mentor is selected
    useEffect(() => {
        if (selectedMentor) {
            const sampleResources = [
                {
                    id: 1,
                    name: "Course Introduction",
                    type: "video",
                    url: "#",
                    size: "45 MB",
                    uploadDate: "2023-10-15",
                    description: "Introduction to the course fundamentals"
                },
                {
                    id: 2,
                    name: "Week 1 - Lecture Notes",
                    type: "pdf",
                    url: "#",
                    size: "2.3 MB",
                    uploadDate: "2023-10-17",
                    description: "Detailed notes from the first week's lecture"
                },
                {
                    id: 3,
                    name: "Data Visualization Examples",
                    type: "image",
                    url: "#",
                    size: "3.7 MB",
                    uploadDate: "2023-10-20",
                    description: "Examples of data visualization techniques"
                },
                {
                    id: 4,
                    name: "Practice Dataset",
                    type: "file",
                    url: "#",
                    size: "15 MB",
                    uploadDate: "2023-10-22",
                    description: "Dataset for practice assignments"
                },
                {
                    id: 5,
                    name: "Additional Reading",
                    type: "link",
                    url: "https://example.com/reading",
                    uploadDate: "2023-10-25",
                    description: "Additional reading materials on the course topic"
                },
                {
                    id: 6,
                    name: "Week 2 - Video Lecture",
                    type: "video",
                    url: "#",
                    size: "120 MB",
                    uploadDate: "2023-10-27",
                    description: "Video recording of the second week's lecture"
                }
            ];
            setResources(sampleResources);
        }
    }, [selectedMentor]);

    const handleSelectMentor = (mentor) => {
        setSelectedMentor(mentor);
    };

    const handleBackToMentors = () => {
        setSelectedMentor(null);
        setResourceType("all");
        setSearchTerm("");
    };

    const handleDownload = (resource) => {
        // In a real app, this would initiate a file download
        console.log(`Downloading: ${resource.name}`);
        alert(`Downloading: ${resource.name}`);
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FileText size={24} className="resource-icon pdf" />;
            case "video":
                return <Video size={24} className="resource-icon video" />;
            case "image":
                return <Image size={24} className="resource-icon image" />;
            case "link":
                return <LinkIcon size={24} className="resource-icon link" />;
            default:
                return <File size={24} className="resource-icon file" />;
        }
    };

    // Filter resources based on search term and type
    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = resourceType === "all" || resource.type === resourceType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="resources-container">
            {selectedMentor ? (
                <>
                    <div className="resources-header">
                        <button className="back-button" onClick={handleBackToMentors}>
                            <ArrowLeft size={20} />
                        </button>
                        <h1>Resources from {selectedMentor.name}</h1>
                    </div>

                    <div className="mentor-info-banner">
                        <div className="mentor-avatar">
                            <img src={selectedMentor.avatar} alt={selectedMentor.name} />
                        </div>
                        <div className="mentor-details">
                            <h2>{selectedMentor.name}</h2>
                            <p>{selectedMentor.course}</p>
                        </div>
                    </div>

                    <div className="resources-controls">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="resource-filters">
                            <button
                                className={resourceType === "all" ? "active" : ""}
                                onClick={() => setResourceType("all")}
                            >
                                All
                            </button>
                            <button
                                className={resourceType === "pdf" ? "active" : ""}
                                onClick={() => setResourceType("pdf")}
                            >
                                Documents
                            </button>
                            <button
                                className={resourceType === "video" ? "active" : ""}
                                onClick={() => setResourceType("video")}
                            >
                                Videos
                            </button>
                            <button
                                className={resourceType === "image" ? "active" : ""}
                                onClick={() => setResourceType("image")}
                            >
                                Images
                            </button>
                            <button
                                className={resourceType === "file" ? "active" : ""}
                                onClick={() => setResourceType("file")}
                            >
                                Files
                            </button>
                            <button
                                className={resourceType === "link" ? "active" : ""}
                                onClick={() => setResourceType("link")}
                            >
                                Links
                            </button>
                        </div>
                    </div>

                    {filteredResources.length > 0 ? (
                        <div className="resources-list">
                            {filteredResources.map((resource) => (
                                <div key={resource.id} className="resource-card">
                                    <div className="resource-icon-container">
                                        {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="resource-details">
                                        <h3>{resource.name}</h3>
                                        <p>{resource.description}</p>
                                        <div className="resource-meta">
                                            {resource.size && <span>{resource.size}</span>}
                                            <span>Uploaded: {resource.uploadDate}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="download-button"
                                        onClick={() => handleDownload(resource)}
                                    >
                                        {resource.type === "link" ? (
                                            <LinkIcon size={20} />
                                        ) : (
                                            <Download size={20} />
                                        )}
                                        {resource.type === "link" ? "Open Link" : "Download"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-resources">
                            <p>No resources found matching your search.</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="resources-header">
                        <h1>Learning Resources</h1>
                    </div>

                    <p className="resources-intro">
                        Select a mentor to access their learning materials, lecture notes, videos, and more.
                    </p>

                    <div className="mentors-grid">
                        {mentors.map((mentor) => (
                            <div
                                key={mentor.id}
                                className="mentor-resources-card"
                                onClick={() => handleSelectMentor(mentor)}
                            >
                                <div className="mentor-resources-avatar">
                                    <img src={mentor.avatar} alt={mentor.name} />
                                </div>
                                <div className="mentor-resources-info">
                                    <h2>{mentor.name}</h2>
                                    <p>{mentor.course}</p>
                                </div>
                                <ChevronRight size={24} className="chevron-icon" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentResources;
