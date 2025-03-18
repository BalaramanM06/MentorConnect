import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";

const PostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id, 10);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  if (!posts || posts.length === 0) {
    return <h2 className="post-detail-container">Post not found</h2>;
  }

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return <h2 className="post-detail-container">Post not found</h2>;
  }

  const [showComments, setShowComments] = useState(post.showComments || false);

  const handleLike = () => {
    if (post.alreadyLiked) return; // Prevent multiple likes

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1, alreadyLiked: true } : p
      )
    );
  };

  const toggleComments = () => {
    setShowComments(!showComments);

    // Update the post's showComments property in the global state
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, showComments: !showComments } : p
      )
    );
  };

  const handleAddComment = (commentText) => {
    if (!commentText.trim()) return;

    const timestamp = new Date().toLocaleTimeString();
    const newComment = `${commentText} (${timestamp})`;

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      navigate("/forum");
    }
  };

  const startEditing = () => {
    setEditedContent(post.content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  const saveEditedPost = () => {
    if (!editedContent.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? { ...p, content: editedContent, lastEdited: new Date().toISOString() }
          : p
      )
    );

    setIsEditing(false);
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

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h2>{post.title}</h2>
        <div className="post-actions-buttons">
          <button className="edit-btn" onClick={startEditing}>✏️</button>
          <button className="delete-btn" onClick={handleDeletePost}>🗑️</button>
          <button className="back-btn" onClick={() => navigate("/forum")}>Back to Forum</button>
        </div>
      </div>

      <div className="post-metadata">
        <p><strong>By:</strong> {post.author}</p>
        <p><strong>Date:</strong> {formatDate(post.date)}</p>
        {post.lastEdited && (
          <p className="post-edited">(Edited: {formatDate(post.lastEdited)})</p>
        )}
      </div>

      {isEditing ? (
        <div className="edit-post-section">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="edit-textarea"
          />
          <div className="edit-actions">
            <button onClick={cancelEditing} className="cancel-edit-btn">Cancel</button>
            <button onClick={saveEditedPost} className="save-edit-btn">Save</button>
          </div>
        </div>
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      <div className="post-actions">
        <button className="like-btn" onClick={handleLike}>
          {post.alreadyLiked ? "👍" : "🤍"} {post.likes} Likes
        </button>
        <button className="comment-btn" onClick={toggleComments}>
          💬 {post.comments ? post.comments.length : 0} Comments
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <p key={index} className="comment">{comment}</p>
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
                handleAddComment(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetail;
