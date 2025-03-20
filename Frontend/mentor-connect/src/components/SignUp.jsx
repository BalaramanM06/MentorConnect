import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignUp.css";
import api from '../utils/axiosConfig';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    isOAuthSignup: false,
  });

  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { email, name } = location.state;

      if (email && name) {
        setFormData(prev => ({
          ...prev,
          email: email,
          fullName: name,
          isOAuthSignup: true,
        }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.isOAuthSignup) {
      if (formData.password !== formData.confirmPassword) {
        setRegistrationError("Passwords do not match!");
        return;
      }
    }

    if (!formData.role) {
      setRegistrationError("Please select a role (Mentor or Student).");
      return;
    }

    // Prepare data for registration
    const registrationData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Submit registration
    api.post("/auth/register", registrationData)
      .then((response) => {
        console.log("Registration successful:", response);
        // Log the full response structure
        console.log("Full response structure:", JSON.stringify(response.data));

        // Save JWT token to localStorage
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);

          // Create a user object with basic fields since the backend might not provide a complete user object
          const userObj = {
            name: formData.fullName,
            email: formData.email,
            role: formData.role
          };

          // Navigate to appropriate dashboard based on role
          if (formData.role === "mentor") {
            console.log("Navigating to mentor dashboard with user data:", userObj);
            navigate('/mentor/dashboard', { state: response.data.user || userObj });
          } else {
            console.log("Navigating to student dashboard with user data:", userObj);
            navigate('/student/dashboard', { state: response.data.user || userObj });
          }
        } else {
          setRegistrationError("Registration failed: No authentication token received");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setRegistrationError(error.response?.data?.message || "Registration failed. Please try again.");
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Your Account</h2>
        {formData.isOAuthSignup && (
          <p style={{ color: '#4CAF50', fontSize: '14px', margin: '10px 0' }}>
            Complete your profile to continue with {formData.email}
          </p>
        )}
        <p style={{ color: '#666', fontSize: '14px', fontFamily: 'sans-serif', margin: '10px 0 20px' }}>
          Join MentorConnect and start your journey to success
        </p>
        {registrationError && (
          <div className="error-message" style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', minHeight: '20px' }}>
            {registrationError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={formData.isOAuthSignup}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={formData.isOAuthSignup}
            />
          </div>

          {!formData.isOAuthSignup && (
            <>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Are you a Mentor or Student?</option>
              <option value="mentor">Mentor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <button type="submit">Sign Up</button>
          <p style={{ marginTop: '20px' }}>
            Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
