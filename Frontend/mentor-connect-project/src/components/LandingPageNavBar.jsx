import { useNavigate } from "react-router-dom";
import "./LandingPageNavBar.css";

export default function LandingPageNavbar() {
  const navigate = useNavigate(); 
  
  return (
    <nav className="navbar">
      <div className="container">
        <span className="logo" onClick={() => navigate("/")}>MentorConnect</span>
        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/mentor-dashboard")}>Mentor Dashboard</li>
          <li onClick={() => navigate("/student-dashboard")}>Student Dashboard</li>
          <li onClick={() => navigate("/forum")}>Forum</li>
          <li onClick={() => navigate("/chat")}>Chat</li>
          <li onClick={() => navigate("/settings")}>Settings</li>
          <li onClick={() => navigate("/login")} className="login-btn">Login</li>
          <li onClick={() => navigate("/signup")} className="signup-btn">Sign Up</li>
        </ul>
      </div>
    </nav>
  );
}
