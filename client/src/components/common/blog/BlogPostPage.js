// client/src/components/common/blog/BlogPostPage.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api";

/**
 * BlogPostPage
 * Displays a single blog post and allows users to read & add comments.
 * 
 * Features:
 * - Fetch post by slug
 * - Fetch comments for this post (only approved ones)
 * - Add new comment (goes to moderation if approval system enabled)
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ user_name: "", content: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  

  // Load post
  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then((r) => setPost(r.data))
      .catch(console.error);
  }, [slug]);

  // Load comments
  useEffect(() => {
    if (post?.id) {
      api.get(`/comments/${post.id}`)
        .then((r) => setComments(r.data))
        .catch((err) => console.error("Error loading comments:", err));
    }
  }, [post]);

  // Submit comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.user_name || !newComment.content) return;

    try {
      const payload = {
        post_id: post.id,
        user_name: newComment.user_name,
        content: newComment.content,
      };

      await api.post("/comments", payload);
      setNewComment({ user_name: "", content: "" });
      setMessage("✅ Your comment has been submitted and is pending approval.");
    } catch (err) {
      setMessage("❌ Failed to submit comment. Please try again.");
    }
  };

  if (!post) return <div className="text-center py-20">Loading…</div>;

  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          ← Back to Blogs
        </button>
        {/* Title */}
        <h1 className="text-4xl font-bold mb-3 text-gray-800">{post.title}</h1>

        {/* Meta info */}
        <div className="text-gray-500 text-sm mb-6">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </div>

        {post.thumbnail && (
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg shadow-lg mb-6">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="max-h-full max-w-full object-contain rounded-md"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12">
          {post.content}
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">💬 Comments</h2>

          {/* Existing comments */}
          <ul className="space-y-4 mb-6">
            {comments.map((c) => (
              <li key={c.id} className="p-4 bg-white border rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <strong className="text-gray-800">{c.user_name}</strong>
                  <small className="text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </small>
                </div>
                <p className="text-gray-700">{c.content}</p>
              </li>
            ))}
            {!comments.length && (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </ul>

          {/* Feedback message */}
          {message && (
            <div className="mb-4 p-3 rounded-md bg-blue-50 text-blue-700">
              {message}
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">💬 Add Your Comment</h2>

          {/* Add Comment Form */}
          <form onSubmit={submitComment} className="space-y-3">
            <input
              className="border rounded-md p-2 w-full focus:ring focus:ring-indigo-200"
              placeholder="Your name"
              value={newComment.user_name}
              onChange={(e) =>
                setNewComment((c) => ({ ...c, user_name: e.target.value }))
              }
            />
            <textarea
              className="border rounded-md p-2 w-full focus:ring focus:ring-indigo-200"
              placeholder="Your comment..."
              value={newComment.content}
              onChange={(e) =>
                setNewComment((c) => ({ ...c, content: e.target.value }))
              }
            />
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
    );
}