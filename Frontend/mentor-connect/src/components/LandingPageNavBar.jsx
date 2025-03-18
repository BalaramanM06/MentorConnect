import { useNavigate } from "react-router-dom";
import "./LandingPageNavBar.css";
import mentorConnectLogo from "../assets/mentor-connect-logo.jpg";
import MCLogo from "../assets/MC-Title-logo.png" ;

export default function LandingPageNavbar() {
  const navigate = useNavigate(); 
  
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo-container">
          <img src={mentorConnectLogo} alt="Logo" className="Logo-img"/>
          <span className="logo" onClick={() => navigate("/")}> <img src={MCLogo} alt="MentorConnect" className="MC-Logo"/></span>
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/forum")}>Forum</li>
          <li onClick={() => navigate("/services")}>Services</li>
          <li onClick={() => navigate("/faq")}>FAQ</li>
          <li onClick={() => navigate("/help")}>Help</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/login")} className="nav-login-btn">Login</li>
          <li onClick={() => navigate("/signup")} className="nav-signup-btn">SignUp</li>
        </ul>
      </div>
    </nav>
  );
}
