import React from "react";
import "./Services.css";

const services = [
  {
    title: "One-on-One Mentorship",
    description: "Get personalized guidance from experienced mentors to accelerate your career growth.",
    symbol: "🎓",
  },
  {
    title: "Networking Opportunities",
    description: "Connect with industry leaders, experts, and like-minded professionals.",
    symbol: "🔗",
  },
  {
    title: "Career Guidance",
    description: "Receive expert advice on resume building, job hunting, and skill development.",
    symbol: "💼",
  },
  {
    title: "Collaboration & Projects",
    description: "Work on real-world projects with mentors and peers to gain practical experience.",
    symbol: "🤝",
  },
];

const Services = () => {
  return (
    <section className="services-section" id="services">
      <div className="service-container">
        <div className="services-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-description">
            Unlock the power of mentorship with our range of services designed to help you grow.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="symbol-container">{service.symbol}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
