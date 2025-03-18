import { useLocation } from "react-router-dom";

const MentorDashboard = () => {
  const location = useLocation();
  const { name, experience, certifications, linkedin } = location.state || {};

  return (
    <div className="dashboard">
      <h2>Mentor Dashboard</h2>

      <div className="dashboard-content">
        <div className="card">
          <h3>Profile Information</h3>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Experience:</strong> {experience} years</p>
          <p><strong>Certifications:</strong> {certifications}</p>
          <p><strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer">Profile</a></p>
        </div>

        <div className="card">
          <h3>Upcoming Sessions</h3>
          <p>You have no upcoming sessions scheduled.</p>
        </div>

        <div className="card">
          <h3>Recent Messages</h3>
          <p>No new messages.</p>
        </div>

        <div className="card">
          <h3>Statistics</h3>
          <p>Total Students: 0</p>
          <p>Sessions Completed: 0</p>
          <p>Rating: N/A</p>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
