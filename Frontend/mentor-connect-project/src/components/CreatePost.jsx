import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Post created successfully!");
    navigate("/forum");
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Discussion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={post.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Write your thoughts here..."
          value={post.content}
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-btn">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
