import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about-section">
      <div>
        <h2 className="about-title">About Mentor Connect</h2>
        <p className="about-description">
          Mentor Connect is a platform designed to bridge the gap between experienced mentors and aspiring professionals. 
          Our mission is to empower individuals by providing access to valuable guidance, networking opportunities, and career insights.
        </p>

        <div className="about-content">
          <div className="about-image">
            <img src="https://source.unsplash.com/600x400/?mentorship,team" alt="Mentorship" />
          </div>
          <div className="about-text">
            <h3>Why Choose Mentor Connect?</h3>
            <p>
              We believe that mentorship is a key factor in career growth and personal development. By connecting mentees with industry experts, we create meaningful relationships that lead to success.
            </p>
            <ul>
              <li>🔹 One-on-one mentorship sessions</li>
              <li>🔹 Career advice from industry leaders</li>
              <li>🔹 Networking opportunities with professionals</li>
              <li>🔹 Skill development through expert guidance</li>
            </ul>
          </div>
        </div>

        <div className="about-mission">
          <h3>Our Mission</h3>
          <p>
            To build a global network of mentors and mentees who collaborate, learn, and grow together. 
            We strive to create a supportive community where knowledge is shared and careers are shaped.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
