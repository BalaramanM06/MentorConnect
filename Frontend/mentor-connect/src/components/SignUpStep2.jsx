import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SignUpStep2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role } = location.state || {};

  const [roleData, setRoleData] = useState({
    experience: "",
    linkedin: "",
    degree: "",
    specialization: "",
    university: "",
  });

  const handleChange = (e) => {
    setRoleData({ ...roleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Sign-up successful as a ${role}!`);
    navigate(role === "mentor" ? "/mentor-dashboard" : "/student-dashboard", { state: { name, role, ...roleData } });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>{role === "mentor" ? "Mentor Details" : "Student Details"}</h2>
        <form onSubmit={handleSubmit}>
          {role === "mentor" ? (
            <>
              <input type="text" name="experience" placeholder="Experience Level (years)" onChange={handleChange} required />
              <input type="url" name="linkedin" placeholder="LinkedIn Profile (for verification)" onChange={handleChange} required />
            </>
          ) : (
            <>
              <input type="text" name="degree" placeholder="current Education" onChange={handleChange} required />
              <input type="text" name="specialization" placeholder="Specialization" onChange={handleChange} required />
              <input type="text" name="university" placeholder="University/College Name" onChange={handleChange} required />
              <input type="url" name="linkedin" placeholder="LinkedIn Profile (optional)" onChange={handleChange} />
            </>
          )}
          <button type="submit">Complete Signup</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpStep2;
