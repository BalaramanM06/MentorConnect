import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Sign-up successful!");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        <p>Join us and start your mentorship journey!</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="divider">Or Sign Up With</div>
        <div className="social-signup">
          <button className="google-btn" onClick={() => navigate('/dashboard')}>Google</button>
          <button className="microsoft-btn" onClick={() => navigate('/dashboard')}>Microsoft</button>
          <button className="linkedin-btn" onClick={() => navigate('/dashboard')}>LinkedIn</button>
        </div>
        <p>Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Log In</span></p>
      </div>
    </div>
  );
};

export default SignUp;