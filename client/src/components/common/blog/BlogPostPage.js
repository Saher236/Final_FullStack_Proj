// client/src/components/common/blog/BlogPostPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  // Load post by slug
  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then((r) => {
        console.log("🟢 Loaded post:", r.data);
        setPost(r.data);
      })
      .catch(console.error);
  }, [slug]);

  // Load comments when post is ready
  useEffect(() => {
    if (post?.id) {
      api.get(`/comments/${post.id}`)
        .then((r) => {
          console.log("🟢 Loaded comments:", r.data);
          setComments(r.data);
        })
        .catch((err) => console.error("Error loading comments:", err));
    }
  }, [post]);

  // Submit comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.user_name || !newComment.content) return;

    const payload = {
      post_id: post?.id,   // ✅ Always use post.id from DB
      user_name: newComment.user_name,
      content: newComment.content
    };

    console.log("📤 Sending comment payload:", payload);

    try {
      await api.post("/comments", payload);
      setNewComment({ user_name: "", content: "" });

      // Reload comments
      const { data } = await api.get(`/comments/${post.id}`);
      setComments(data);
    } catch (err) {
      console.error("❌ Error submitting comment:", err.response?.data || err.message);
      alert("Failed to submit comment");
    }
  };

  if (!post) return <div className="text-center py-20">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="mb-6">{post.content}</p>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="p-3 bg-gray-100 rounded-md">
              <strong>{c.user_name}</strong>
              <p>{c.content}</p>
              <small className="text-gray-500">
                {new Date(c.created_at).toLocaleString()}
              </small>
            </li>
          ))}
          {!comments.length && <p>No comments yet.</p>}
        </ul>

        {/* Add Comment Form */}
        <form onSubmit={submitComment} className="mt-6 space-y-3">
          <input
            className="border rounded-md p-2 w-full"
            placeholder="Your name"
            value={newComment.user_name}
            onChange={(e) =>
              setNewComment((c) => ({ ...c, user_name: e.target.value }))
            }
          />
          <textarea
            className="border rounded-md p-2 w-full"
            placeholder="Your comment..."
            value={newComment.content}
            onChange={(e) =>
              setNewComment((c) => ({ ...c, content: e.target.value }))
            }
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}