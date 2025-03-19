import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    isOAuthSignup: false,
  });

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
        const invalidSpan = document.querySelector(".invalid-span");
        invalidSpan.textContent = "Passwords do not match!";
        return;
      }
    }

    if (!formData.role) {
      const invalidSpan = document.querySelector(".invalid-span");
      invalidSpan.textContent = "Please select a role (Mentor or Student).";
      return;
    }

    navigate("/signup-step2", { state: { name: formData.fullName, role: formData.role } });
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
        <div className="invalid-span" style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', minHeight: '20px' }}></div>

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

          <button type="submit">Continue</button>
          <p style={{ marginTop: '20px' }}>
            Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
