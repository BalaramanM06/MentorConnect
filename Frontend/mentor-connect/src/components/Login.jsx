import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import GoogleIcon from "../assets/Google-icon.png"
import MicrosoftIcon from "../assets/Microsoft-icon.png";
import LinkedinIcon from "../assets/LinkedIn-icon.png";

// Since Firebase is not yet installed, I'm creating a mock authentication service
// that simulates the behavior - in a real implementation, you would use Firebase here
const mockAuthService = {
  // Simulates checking if a user exists
  checkUserExists: (email) => {
    // In a real implementation, this would check your database
    // For this mock, we'll assume users with gmail.com are registered
    return email.includes("gmail.com");
  },

  // Simulate Google sign-in
  signInWithGoogle: () => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Mock user data that would come from Google
        resolve({
          email: "user@gmail.com",
          displayName: "Demo User",
          // In a real implementation, this would be the actual user data from Google
        });
      }, 1000);
    });
  }
};

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

    try {
      console.log("Logging in with", email, password);
      if (mockAuthService.checkUserExists(email)) {
        navigate('/dashboard');
      } else {
        setError("User not found. Please sign up first.");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const userData = await mockAuthService.signInWithGoogle();
      if (mockAuthService.checkUserExists(userData.email)) {
        navigate('/dashboard');
      } else {
        navigate('/signup', { state: { email: userData.email, name: userData.displayName } });
      }
    } catch (error) {
      setError("Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
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
        <p className="divider">OR</p>
        <div className="social-login">
          <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
            <img src={GoogleIcon} alt="Login by Google" className="Login-Google-Logo" />
          </button>
          <button className="microsoft-btn" disabled={loading}>
            <img src={MicrosoftIcon} alt="Login by Microsoft" className="Login-Microsoft-Logo" />
          </button>
          <button className="linkedin-btn" disabled={loading}>
            <img src={LinkedinIcon} alt="Login by LinkedIn" className="Login-Linkedin-Logo" />
          </button>
        </div>
        <p>Don't have an account? <span className="signup-link" style={{ color: 'blue' }} onClick={() => navigate('/signup')}>Sign Up</span></p>
      </div>
    </div>
  );
}
