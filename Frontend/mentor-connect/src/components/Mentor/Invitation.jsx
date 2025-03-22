import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Calendar, Clock, BookOpen, User, Mail } from "lucide-react";
import "./Invitation.css";
import api from "../../utils/axiosConfig";

const Invitation = () => {
    const [showInvitations, setShowInvitations] = useState(false);
    const [invitations, setInvitations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const invitationRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
            if (response.data?.getAllPendingRequest) {
                setInvitations(response.data.getAllPendingRequest);
                console.log(invitations);
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

    useEffect(() => {
        const count = invitations.filter(inv => !inv.read).length;
        setUnreadCount(count);
    }, [invitations]);

    useEffect(() => {
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
