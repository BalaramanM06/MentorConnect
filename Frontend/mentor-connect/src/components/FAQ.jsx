import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "What is Mentor Connect?",
    answer: "Mentor Connect is a platform that connects mentees with experienced mentors to help them grow professionally and personally.",
  },
  {
    question: "How can I become a mentor?",
    answer: "You can apply to be a mentor by signing up and completing your profile. Our team will review your application and approve it based on experience and expertise.",
  },
  {
    question: "Is Mentor Connect free to use?",
    answer: "Yes! Basic mentorship services are free. However, some premium mentorship programs may have additional charges.",
  },
  {
    question: "How do I find a mentor?",
    answer: "Simply browse the mentor directory, filter by expertise, and send a connection request to your desired mentor.",
  },
  {
    question: "Can I have multiple mentors?",
    answer: "Yes! You can connect with multiple mentors to get diverse perspectives and guidance.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-description">
          Find answers to the most commonly asked questions about Mentor Connect.
        </p>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
              </div>
              {openIndex === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
    </section>
  );
};

export default FAQ;
