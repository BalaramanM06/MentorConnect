import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import "./StudentNotification.css";

const StudentNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Load notifications from localStorage
    useEffect(() => {
        const loadNotifications = () => {
            const storedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");

            // Add sample notifications if none exist
            if (storedNotifications.length === 0) {
                const sampleNotifications = [
                    {
                        id: 1,
                        type: "session",
                        message: "Your next session with Dr. Sarah Chen is scheduled for tomorrow at 10:30 AM",
                        time: "2 hours ago",
                        read: false
                    },
                    {
                        id: 2,
                        type: "course",
                        message: "Your enrollment in 'Machine Learning Fundamentals' has been confirmed",
                        time: "1 day ago",
                        read: false
                    },
                    {
                        id: 3,
                        type: "message",
                        message: "Prof. James Wilson has sent you a message regarding your project",
                        time: "2 days ago",
                        read: true
                    },
                    {
                        id: 4,
                        type: "session",
                        message: "Reminder: Upcoming session with Michael Rodriguez in 3 hours",
                        time: "3 hours ago",
                        read: true
                    }
                ];
                localStorage.setItem("notifications", JSON.stringify(sampleNotifications));
                setNotifications(sampleNotifications);
            } else {
                setNotifications(storedNotifications);
            }
        };

        loadNotifications();

        // Add event listener for storage changes
        window.addEventListener("storage", (e) => {
            if (e.key === "notifications") {
                loadNotifications();
            }
        });

        return () => {
            window.removeEventListener("storage", (e) => {
                if (e.key === "notifications") {
                    loadNotifications();
                }
            });
        };
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
        setNotifications(updatedNotifications);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "session":
                return "📅";
            case "course":
                return "📚";
            case "message":
                return "✉️";
            default:
                return "🔔";
        }
    };

    const unreadCount = notifications.filter((notification) => !notification.read).length;

    return (
        <div className="student-notification" ref={dropdownRef}>
            <div className="notification-icon" onClick={toggleDropdown} title="Notifications">
                <Bell size={24} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-read" onClick={markAllAsRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? "read" : "unread"}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="notification-icon-type">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <p>{notification.message}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">No notifications at this time</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentNotification;
