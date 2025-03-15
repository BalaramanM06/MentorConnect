import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

const Forum = ({ posts, setPosts }) => {
  const navigate = useNavigate();
  const [alreadyLiked, setAlreadyLiked] = useState(false);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId && !post.alreadyLiked ? { ...post, likes: post.likes + 1 , alreadyLiked: true} : post
      )
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

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, commentText] }
          : post
      )
    );
  };

  return (
    <div className="forum-container">
      <h1>Mentor Connect Forum</h1>
      <button className="new-post-btn" onClick={() => navigate("/create-post")}>
        + New Post
      </button>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3 onClick={() => navigate(`/post/${post.id}`)}>{post.title}</h3>
            <p>By {post.author}</p>
            <div className="post-info">
              <button className="like-btn" onClick={() => handleLike(post.id)}>
                {post.alreadyLiked ? "👍" : "🤍"} {post.likes} Likes
              </button>
              <button className="comment-btn" onClick={() => toggleComments(post.id)}>
                💬 {post.comments.length} Comments
              </button>
            </div>

            {post.showComments && (
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
                      handleAddComment(post.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
