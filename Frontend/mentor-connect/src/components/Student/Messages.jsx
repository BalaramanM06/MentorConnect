import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Messages.css";
import ChatRoom from "../Chat/ChatRoom";
import api from "../../utils/axiosConfig";

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedMentor, selectedMentorEmail } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Authentication required. Please log in.");
          navigate("/login");
          return;
        }

        try {
          // Try to fetch user profile from backend API
          const response = await api.get("/auth/profile");
          if (response.data) {
            setCurrentUser(response.data);
            localStorage.setItem("userProfile", JSON.stringify(response.data));
          } else {
            throw new Error("Invalid user data response");
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);

          // Fallback: Extract user info from token
          const email = extractEmailFromToken(token);
          const userData = {
            email: email,
            name: email.split('@')[0].replace('.', ' '),
            role: 'STUDENT'
          };

          setCurrentUser(userData);
          localStorage.setItem("userProfile", JSON.stringify(userData));
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
      return payload.sub || 'student@example.com';
    } catch (error) {
      console.error("Error extracting email from token:", error);
      return 'student@example.com';
    }
  };

  // Log received state for debugging
  useEffect(() => {
    if (selectedMentor) {
      console.log("Messages component received mentor:", selectedMentor, selectedMentorEmail);
    }
  }, [selectedMentor, selectedMentorEmail]);

  if (isLoading) {
    return (
      <div className="messages-page loading">
        <div className="spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-page error">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <ChatRoom
        initialSelectedMentor={selectedMentor ? {
          name: selectedMentor,
          email: selectedMentorEmail || `${selectedMentor.toLowerCase().replace(/\s+/g, '.')}@example.com`
        } : null}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Messages;
