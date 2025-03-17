import { useLocation } from "react-router-dom";

const MentorDashboard = () => {
  const location = useLocation();
  const { name, experience, certifications, linkedin } = location.state || {};

  return (
    <div className="dashboard">
      <h2>Mentor Dashboard</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Experience:</strong> {experience} years</p>
      <p><strong>Certifications:</strong> {certifications}</p>
      <p><strong>LinkedIn:</strong> <a href={linkedin} target="_blank">Profile</a></p>
    </div>
  );
};

export default MentorDashboard;
