import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import api from "../utils/axiosConfig";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    api.post("/auth/login", { email, password })
      .then((response) => {
        console.log("Login successful:", response.data);

        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);

          const role = response.data.role || "mentee"; 

          if (role === "MENTOR") {
            navigate('/mentor/dashboard', { state: response.data.user });
          } else {
            navigate('/student/dashboard', { state: response.data.user });
          }
        } else {
          setError("Login failed: No authentication token received");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError(error.response?.data?.message || "Login failed. Please check your credentials.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Login to your MentorConnect account</p>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>Don't have an account? <span className="signup-link" style={{ color: 'blue' }} onClick={() => navigate('/signup')}>Sign Up</span></p>
      </div>
    </div>
  );
}
