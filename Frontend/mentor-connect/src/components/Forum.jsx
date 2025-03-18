import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

const Forum = ({ posts, setPosts }) => {
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId && !post.alreadyLiked) {
          const updatedPost = {
            ...post,
            likes: post.likes + 1,
            alreadyLiked: true
          };
          return updatedPost;
        }
        return post;
      })
    );
  };

  const toggleComments = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, showComments: !post.showComments } : post
      )
    );
  };

  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const newComment = `${commentText} (${timestamp})`;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const goToCreatePost = () => {
    navigate("/create-post");
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
  };

  const startEditing = (post) => {
    setEditingPost(post.id);
    setEditedContent(post.content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingPost(null);
    setEditedContent("");
  };

  // Save edited post
  const saveEditedPost = (postId) => {
    if (!editedContent.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, content: editedContent, lastEdited: new Date().toISOString() }
          : post
      )
    );

    setEditingPost(null);
    setEditedContent("");
  };

  return (
    <div className="forum-container">
      <h1>Mentor Connect Forum</h1>
      <button
        className="new-post-btn"
        onClick={goToCreatePost}>
        + New Post
      </button>
      <div className="posts-list">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
            >
              <div className="post-header">
                <h3 onClick={() => navigate(`/post/${post.id}`)}>{post.title}</h3>
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => startEditing(post)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>🗑️</button>
                </div>
              </div>
              <div className="post-metadata">
                <p className="post-author">By {post.author}</p>
                {post.date && <p className="post-date">{formatDate(post.date)}</p>}
                {post.lastEdited && <p className="post-edited">(Edited: {formatDate(post.lastEdited)})</p>}
              </div>

              {editingPost === post.id ? (
                <div className="edit-post-section">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="edit-actions">
                    <button onClick={cancelEditing} className="cancel-edit-btn">Cancel</button>
                    <button onClick={() => saveEditedPost(post.id)} className="save-edit-btn">Save</button>
                  </div>
                </div>
              ) : (
                <p className="post-content">{post.content && post.content.substring(0, 150)}
                  {post.content && post.content.length > 150 ? '...' : ''}
                </p>
              )}

              <div className="post-info">
                <button className="like-btn" onClick={() => handleLike(post.id)}>
                  {post.alreadyLiked ? "👍" : "🤍"} {post.likes} Likes
                </button>
                <button className="comment-btn" onClick={() => toggleComments(post.id)}>
                  💬 {post.comments ? post.comments.length : 0} Comments
                </button>
              </div>

              {post.showComments && (
                <div className="comments-section">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment, index) => (
                      <p key={index} className="comment">💬 {comment}</p>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet. Add one!</p>
                  )}
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="comment-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment(post.id, e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No posts yet. Be the first to create a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
