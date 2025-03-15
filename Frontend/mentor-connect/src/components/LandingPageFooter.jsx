import { useNavigate } from "react-router-dom";
import "./LandingPageFooter.css";

export default function LandingPageFooter() {
  const navigate = useNavigate(); 
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>MentorConnect</h2>
          <p>Connecting mentors and students for a brighter future.</p>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate("/about")}>About</li>
            <li onClick={() => navigate("/services")}>Services</li>
            <li onClick={() => navigate("/contact")}>Contact</li>
            <li onClick={() => navigate("/faq")}>FAQ</li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: support@mentorconnect.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 MentorConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}
