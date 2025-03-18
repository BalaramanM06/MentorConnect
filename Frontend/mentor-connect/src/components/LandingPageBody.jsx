import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect, useState } from "react";
import "./LandingPageBody.css";
import Navbar from "./LandingPageNavBar";
import Elsa from "../assets/Elsa.jpeg";
import John from "../assets/John.jpeg";
import Akita from "../assets/Akita.jpg";
import Collins from "../assets/Collins.jpg";
import Walsh from "../assets/Walls.jpeg";
import Maraboli from "../assets/Maraboli.jpg";
import Kazi from "../assets/Kazi.jpg";

export default function LandingPageBody() {
    const navigate = useNavigate();
    const testimonialContainerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const totalTestimonials = 7;

    const scrollTestimonials = (direction) => {
        if (testimonialContainerRef.current) {
            const container = testimonialContainerRef.current;
            const testimonialWidth = container.querySelector('.testimonial').offsetWidth;
            const gap = 32;
            const scrollAmount = testimonialWidth + gap;
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (direction === 'prev') {
                if (container.scrollLeft <= 0) {
                    container.scrollLeft = maxScroll;
                    setActiveIndex(totalTestimonials - 3);
                } else {
                    container.scrollLeft -= scrollAmount;
                    setActiveIndex(prev => Math.max(0, prev - 1));
                }
            } else {
                if (container.scrollLeft >= maxScroll) {
                    container.scrollLeft = 0;
                    setActiveIndex(0);
                } else {
                    container.scrollLeft += scrollAmount;
                    setActiveIndex(prev => Math.min(totalTestimonials - 3, prev + 1));
                }
            }
        }
    };

    const scrollToIndex = (index) => {
        if (testimonialContainerRef.current) {
            const container = testimonialContainerRef.current;
            const testimonialWidth = container.querySelector('.testimonial').offsetWidth;
            const gap = 32;
            const scrollAmount = index * (testimonialWidth + gap);

            container.scrollLeft = scrollAmount;
            setActiveIndex(index);
        }
    };

    useEffect(() => {
        if (testimonialContainerRef.current) {
            const container = testimonialContainerRef.current;
            container.style.scrollbarWidth = 'none';
            container.style.msOverflowStyle = 'none';

            const handleScroll = () => {
                const testimonialWidth = container.querySelector('.testimonial').offsetWidth;
                const gap = 32;
                const newIndex = Math.round(container.scrollLeft / (testimonialWidth + gap));
                setActiveIndex(newIndex);
            };

            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const indicatorCount = Math.max(0, totalTestimonials - 2);

    return (
        <div className="landing-page">
            <div className="top-body-section">
                <header className="body-section">
                    <div className="body-content-overlay">
                        <Navbar />
                        <h1>Connecting Mentors & Students for a Brighter Future</h1>
                        <p>Find the perfect mentor to guide your learning journey and career growth.</p>
                        <div className="cta-buttons">
                            <button onClick={() => navigate("/signup")} className="get-started-btn">Get Started</button>
                        </div>
                    </div>
                    <div className="body-overlay-image"></div>
                </header>
            </div>

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
                <div className="testimonial-container" ref={testimonialContainerRef}>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Elsa} alt="Mentor Elsa" />
                        </div>
                        <p>"MentorConnect helped me find the right mentor, and it changed my career!"</p>
                        <span>- Sarah M.</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={John} alt="Mentor John" />
                        </div>
                        <p>"A great platform for students to gain real-world insights from experts."</p>
                        <span>- John D.</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Kazi} alt="Mentor Kazi" />
                        </div>
                        <p>"True mentors have this unique ability to pick up vibes that everyone else misses from within you."</p>
                        <span>- Ahmad R Kazi</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Akita} alt="Mentor Akita" />
                        </div>
                        <p>"With careful guidance and mentorship, you will reach your highest self."</p>
                        <span>- Akita</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Collins} alt="Mentor Collins" />
                        </div>
                        <p>"In learning, you will teach, and in teaching, you will learn."</p>
                        <span>- Phil Collins</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Walsh} alt="Mentor Walsh" />
                        </div>
                        <p>"Your mentors in life are important, choose them wisely."</p>
                        <span>- Bill Walsh</span>
                    </div>
                    <div className="testimonial">
                        <div className="mentor-quote-image">
                            <img src={Maraboli} alt="Mentor Maraboli" />
                        </div>
                        <p>"My mistakes have been my greatest mentors."</p>
                        <span>- Steve Maraboli</span>
                    </div>
                </div>
                <div className="carousel-indicators">
                    {Array.from({ length: indicatorCount }).map((_, index) => (
                        <div
                            key={index}
                            className={`carousel-indicator ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => scrollToIndex(index)}
                        />
                    ))}
                </div>
                <button className="navigation-button prev-button" onClick={() => scrollTestimonials('prev')}>&#8249;</button>
                <button className="navigation-button next-button" onClick={() => scrollTestimonials('next')}>&#8250;</button>
            </section>

            <section className="get-started">
                <h2>Start Your Mentorship Journey Today</h2>
                <p>Sign up now and take your learning to the next level.</p>
                <button onClick={() => navigate("/signup")} className="join-btn">Join Now</button>
            </section>
        </div>
    );
}