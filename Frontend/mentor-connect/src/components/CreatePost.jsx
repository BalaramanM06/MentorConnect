import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = ({ addNewPost }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      author,
      title,
      content,
      date: new Date().toLocaleDateString(),
      comments: []
    };
    addNewPost(newPost);
    navigate('/forum');
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="author">Your Name</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/forum')}>
            Cancel
          </button>
          <button type="submit">Submit Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
