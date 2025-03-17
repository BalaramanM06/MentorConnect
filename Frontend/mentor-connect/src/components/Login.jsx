import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import GoogleIcon from "../assets/Google-icon.png"
import MicrosoftIcon from "../assets/Microsoft-icon.png" ;
import LinkedinIcon from "../assets/LinkedIn-icon.png" ;


export default function Login() {
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Login to your MentorConnect account</p>
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
          <button type="submit" className="login-login-btn">Login</button>
        </form>
        <p className="divider">OR</p>
        <div className="social-login">
        <button className="google-btn" onClick={() => navigate("/dashboard")}> <img src={GoogleIcon} alt="Login by Google" className="Login-Google-Logo"/></button>
        <button className="microsoft-btn" onClick={() => navigate('/dashboard')}> <img src={MicrosoftIcon} alt="Login by Microsoft" className="Login-Microsoft-Logo"/></button>
        <button className="linkedin-btn" onClick={() => navigate('/dashboard')}> <img src={LinkedinIcon} alt="Login by LinkedIn" className="Login-Linkedin-Logo"/></button>
        </div>
        <p>Don't have an account? <span className="signup-link" style={{color: 'blue'}} onClick={() => navigate('/signup')}>Sign Up</span></p>
      </div>
    </div>
  );
}
