import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Setting.css';

const Setting = () => {
    const [photoName, setPhotoName] = useState('default-profile.png');
    const navigate = useNavigate();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoName(file.name);
            console.log('Profile photo updated to:', file.name);
            alert('Profile photo updated successfully!');
            setTimeout(() => {
                navigate('/student/dashboard');
            }, 1000);
        }
    };

    const handleButtonClick = () => {
        document.getElementById('photo-input').click();
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            // Clear any stored user data
            localStorage.removeItem("enrolledCourses");
            // Redirect to login page
            navigate('/login');
        }
    };

    return (
        <div className="setting-container">
            <h2>Settings</h2>
            <div className="profile-photo-section">
                <h3>Update Profile Photo</h3>
                <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                />
                <button onClick={handleButtonClick} className="update-photo-btn">
                    Update Photo
                    <span className="tooltip">Update Profile Photo</span>
                </button>
                <p>Current Photo: {photoName}</p>
            </div>

            <div className="logout-section">
                <h3>Account</h3>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
                <p>Sign out from your account</p>
            </div>
        </div>
    );
};

export default Setting; 