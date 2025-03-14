import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import MentorDashboard from "./components/Mentor/MentorDashboard.jsx";
import StudentDashboard from "./components/Student/StudentDashboard.jsx";
import LandingPage from "./components/LandingPage.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import Services from "./components/Services.jsx";
import FAQ from "./components/FAQ.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQ/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
