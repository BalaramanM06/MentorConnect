import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";

const PostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = parseInt(id, 10);

  if (!posts || posts.length === 0) {
    return <h2 className="post-detail-container">Post not found</h2>;
  }

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return <h2 className="post-detail-container">Post not found</h2>;
  }

  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = (commentText) => {
    if (!commentText.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, commentText] }
          : p
      )
    );
  };

  return (
    <div className="post-detail-container">
      <h2>{post.title}</h2>
      <p><strong>By:</strong> {post.author}</p>
      <p className="post-content">{post.content}</p> 

      <div className="post-actions">
        <button className="like-btn" onClick={handleLike}>
          👍 {post.likes} Likes
        </button>
        <button className="comment-btn" onClick={toggleComments}>
          💬 {post.comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <p key={index} className="comment">💬 {comment}</p>
            ))
          ) : (
            <p className="no-comments">No comments yet. Add one!</p>
          )}
          <input
            type="text"
            placeholder="Write a comment..."
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
