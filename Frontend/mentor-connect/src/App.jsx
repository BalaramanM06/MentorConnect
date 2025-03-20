import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
import FindCourses from "./components/Student/FindCourses.jsx";
import Payment from "./components/Student/Payment.jsx";
import Messages from "./components/Student/Messages.jsx";
import CourseTracker from "./components/Student/CourseTracker.jsx";
import Setting from "./components/Student/Setting.jsx";
import Enroll from "./components/Student/Enroll.jsx";
import StudentResources from "./components/Student/StudentResources.jsx";
import UpcomingSessions from "./components/Student/UpcomingSessions.jsx";

function App() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts && JSON.parse(savedPosts).length > 0) {
      return JSON.parse(savedPosts);
    }


    return [
      {
        id: 1,
        title: "How to find a good mentor?",
        author: "Alice",
        content: "I'm looking for a mentor who can help me with my career. I'm not sure how to find one. Can you help me?",
        date: "2021-01-01",
        likes: 0,
        alreadyLiked: false,
        comments: [],
        showComments: false
      },
      {
        id: 2,
        title: "Best resources for learning React?",
        author: "Bob",
        content: "I'm looking for the best resources for learning React. Can you help me?",
        date: "2021-01-02",
        likes: 0,
        alreadyLiked: false,
        comments: [],
        showComments: false
      },
      {
        id: 3,
        title: "How to improve networking skills?",
        author: "Charlie",
        content: "I'm looking for the best resources for improving my networking skills. Can you help me?",
        date: "2021-01-03",
        likes: 0,
        alreadyLiked: false,
        comments: [],
        showComments: false
      },
    ];
  });

  const [role, setRole] = useState("");
  const addNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
  }, [posts]);


  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'forumPosts') {
        const updatedPosts = JSON.parse(e.newValue);
        if (updatedPosts) {
          setPosts(updatedPosts);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/forum" element={<Forum posts={posts} setPosts={setPosts} />} />
        <Route path="/create-post" element={<CreatePost setPosts={setPosts} existingPosts={posts} />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/find-courses" element={<FindCourses />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/course-tracker" element={<CourseTracker />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/resources" element={<StudentResources />} />
        <Route path="upcoming-sessions" element={<UpcomingSessions />} />
      </Routes>
    </Router>
  );
}

export default App;
