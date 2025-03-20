import React, { useState, useEffect, useRef } from "react";
import { Settings, Upload, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const SettingsMenu = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate("/login");
    };

    const handleUpdatePhoto = () => {
        // This will be implemented later
        console.log("Update photo clicked");
    };

    return (
        <div className="settings-menu" ref={dropdownRef}>
            <div className="settings-icon" onClick={toggleDropdown} title="Settings">
                <Settings size={20} />
            </div>

            {showDropdown && (
                <div className="settings-dropdown">
                    <div className="settings-item" onClick={handleUpdatePhoto}>
                        <Upload size={16} />
                        <span>Update Photo</span>
                    </div>
                    <div className="settings-item" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsMenu; 