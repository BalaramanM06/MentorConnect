import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Calendar, Clock, BookOpen, User, Mail } from "lucide-react";
import "./Invitation.css";

const Invitation = () => {
    const [showInvitations, setShowInvitations] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const invitationRef = useRef(null);

    useEffect(() => {
        const storedInvitations = JSON.parse(localStorage.getItem("mentorInvitations") || "[]");
        if (storedInvitations.length === 0) {
            const sampleInvitations = [
                {
                    id: 1,
                    student: {
                        name: "Alex Johnson",
                        id: "STU12345",
                        profilePic: null
                    },
                    course: "Web Development Fundamentals",
                    message: "I'm interested in your expertise in React and modern web development. Would you be available to mentor me?",
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    read: false
                },
                {
                    id: 2,
                    student: {
                        name: "Emily Chen",
                        id: "STU67890",
                        profilePic: null
                    },
                    course: "Data Science Essentials",
                    message: "Looking for guidance on machine learning projects and building a portfolio.",
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    read: true
                },
                {
                    id: 3,
                    student: {
                        name: "Michael Smith",
                        id: "STU24680",
                        profilePic: null
                    },
                    course: "Mobile App Development",
                    message: "Need help with app architecture and publishing to app stores.",
                    date: new Date().toISOString(),
                    read: false
                }
            ];

            localStorage.setItem("mentorInvitations", JSON.stringify(sampleInvitations));
            setInvitations(sampleInvitations);
        } else {
            setInvitations(storedInvitations);
        }
    }, []);

    useEffect(() => {
        // Count unread invitations
        const count = invitations.filter(inv => !inv.read).length;
        setUnreadCount(count);
    }, [invitations]);

    useEffect(() => {
        // Close the dropdown when clicking outside
        function handleClickOutside(event) {
            if (invitationRef.current && !invitationRef.current.contains(event.target)) {
                setShowInvitations(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleInvitations = () => {
        setShowInvitations(!showInvitations);
    };

    const handleInvitationClick = (id) => {
        // Mark as read when clicked
        const updatedInvitations = invitations.map(inv => {
            if (inv.id === id && !inv.read) {
                return { ...inv, read: true };
            }
            return inv;
        });

        setInvitations(updatedInvitations);
        localStorage.setItem("mentorInvitations", JSON.stringify(updatedInvitations));
    };

    const handleAccept = (id) => {
        const updatedInvitations = invitations.map(inv => {
            if (inv.id === id) {
                return { ...inv, status: "accepted", read: true };
            }
            return inv;
        });

        setInvitations(updatedInvitations);
        localStorage.setItem("mentorInvitations", JSON.stringify(updatedInvitations));

        // In a real app, you would send this acceptance to your backend
        alert("Invitation accepted successfully!");
    };

    const handleReject = (id) => {
        const updatedInvitations = invitations.map(inv => {
            if (inv.id === id) {
                return { ...inv, status: "rejected", read: true };
            }
            return inv;
        });

        setInvitations(updatedInvitations);
        localStorage.setItem("mentorInvitations", JSON.stringify(updatedInvitations));

        // In a real app, you would send this rejection to your backend
        alert("Invitation rejected.");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        }
    };

    return (
        <div className="invitation-container" ref={invitationRef}>
            <div className="invitation-icon" onClick={toggleInvitations}>
                <Mail size={24} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>

            {showInvitations && (
                <div className="invitation-dropdown">
                    <div className="invitation-header">
                        <h3>Course Invitations</h3>
                        {invitations.length > 0 && (
                            <span className="total-count">{invitations.length}</span>
                        )}
                    </div>

                    <div className="invitation-list">
                        {invitations.length > 0 ? (
                            invitations.map(invitation => (
                                <div
                                    key={invitation.id}
                                    className={`invitation-item ${!invitation.read ? "unread" : ""} ${invitation.status ? invitation.status : ""}`}
                                    onClick={() => handleInvitationClick(invitation.id)}
                                >
                                    <div className="invitation-avatar">
                                        {invitation.student.profilePic ? (
                                            <img src={invitation.student.profilePic} alt={invitation.student.name} />
                                        ) : (
                                            <div className="default-avatar">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="invitation-content">
                                        <div className="invitation-info">
                                            <h4>{invitation.student.name}</h4>
                                            <span className="date">{formatDate(invitation.date)}</span>
                                        </div>

                                        <div className="course-name">
                                            <BookOpen size={14} />
                                            <span>{invitation.course}</span>
                                        </div>

                                        <p className="invitation-message">{invitation.message}</p>

                                        {!invitation.status && (
                                            <div className="invitation-actions">
                                                <button
                                                    className="accept-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAccept(invitation.id);
                                                    }}
                                                >
                                                    <Check size={14} />
                                                    Accept
                                                </button>

                                                <button
                                                    className="reject-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleReject(invitation.id);
                                                    }}
                                                >
                                                    <X size={14} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {invitation.status && (
                                            <div className="status-indicator">
                                                {invitation.status === "accepted" ? (
                                                    <span className="status accepted">
                                                        <Check size={14} />
                                                        Accepted
                                                    </span>
                                                ) : (
                                                    <span className="status rejected">
                                                        <X size={14} />
                                                        Rejected
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-invitations">
                                <Mail size={24} />
                                <p>No invitations yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invitation;
