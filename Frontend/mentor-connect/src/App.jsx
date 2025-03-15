import React, { useState, useEffect } from "react";
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
import Forum from "./components/Forum.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostDetail from "./components/PostDetail.jsx";
import Help from "./components/Help.jsx";

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1, 
      title: "How to find a good mentor?", 
      author: "Alice",
      content: "I'm looking for a mentor who can help me with my career. I'm not sure how to find one. Can you help me?",
      date: "2021-01-01",
      likes: 0,
      comments: [],
    },
    {
      id: 2, 
      title: "Best resources for learning React?", 
      author: "Bob",
      content: "I'm looking for the best resources for learning React. Can you help me?",
      date: "2021-01-02",
      likes:0 ,
      comments: [],
    },
    {
      id: 3,
      title: "How to improve networking skills?", 
      author: "Charlie",
      content: "I'm looking for the best resources for improving my networking skills. Can you help me?",
      date: "2021-01-03",
      likes: 0,
      comments: [],
    },
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/forum" element={<Forum posts={posts} setPosts={setPosts} />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
