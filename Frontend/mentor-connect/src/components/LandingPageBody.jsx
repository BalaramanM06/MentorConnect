import { useNavigate } from "react-router-dom";
import "./LandingPageBody.css";
import Navbar from "./LandingPageNavBar";
export default function LandingPageBody() {
    const navigate = useNavigate();
    return (
        <div className="landing-page">
            <header className="hero-section">
                <div className="hero-content">
                    <Navbar />
                    <h1>Connecting Mentors & Students for a Brighter Future</h1>
                    <p>Find the perfect mentor to guide your learning journey and career growth.</p>
                    <div className="cta-buttons">
                        <button onClick={() => navigate("/signup")} className="get-started-btn">Get Started</button>
                    </div>
                </div>
            </header>

            <section className="features">
                <h2>Why Choose MentorConnect?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>Expert Mentors</h3>
                        <p>Get guidance from experienced professionals in various fields.</p>
                    </div>
                    <div className="feature-card">
                        <h3>One-on-One Sessions</h3>
                        <p>Personalized mentorship tailored to your goals and learning style.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Community Support</h3>
                        <p>Join a network of learners and mentors to collaborate and grow.</p>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h2>What Our Users Say</h2>
                <div className="testimonial-container">
                    <div className="testimonial">
                        <p>"MentorConnect helped me find the right mentor, and it changed my career!"</p>
                        <span>- Sarah M.</span>
                    </div>
                    <div className="testimonial">
                        <p>"A great platform for students to gain real-world insights from experts."</p>
                        <span>- John D.</span>
                    </div>
                </div>
            </section>

            <section className="get-started">
                <h2>Start Your Mentorship Journey Today</h2>
                <p>Sign up now and take your learning to the next level.</p>
                <button onClick={() => navigate("/signup")} className="join-btn">Join Now</button>
            </section>
        </div>
    );
}