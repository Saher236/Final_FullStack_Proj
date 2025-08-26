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
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch post by slug
  useEffect(() => {
    setLoadingPost(true);
    api.get(`/posts/${slug}`)
      .then((r) => setPost(r.data))
      .catch((err) => {
        console.error("Error loading post:", err);
        setError("Failed to load post");
      })
      .finally(() => setLoadingPost(false));
  }, [slug]);

  // Fetch comments when post is loaded
  useEffect(() => {
    if (post?.id) {
      setLoadingComments(true);
      api.get(`/comments/${post.id}`)
        .then((r) => setComments(r.data || []))
        .catch((err) => {
          console.error("Error loading comments:", err);
          setError("Failed to load comments");
        })
        .finally(() => setLoadingComments(false));
    }
  }, [post]);

  // Submit new comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.user_name.trim() || !newComment.content.trim()) return;

    try {
      setSubmitting(true);
      await api.post("/comments", {
        post_id: post.id,
        ...newComment,
      });

      // Reset form
      setNewComment({ user_name: "", content: "" });

      // Refresh comments
      api.get(`/comments/${post.id}`).then((r) => setComments(r.data));
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost) return <div className="text-center py-20">Loading post…</div>;
  if (!post) return <div className="text-center py-20 text-red-600">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Post Content */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.thumbnail && (
        <img
          className="w-full max-h-[600px] rounded-lg mb-6 shadow-md object-contain mx-auto"
          src={post.thumbnail}
          alt={post.title}
        />
      )}
      <p className="prose prose-lg text-gray-800 leading-relaxed">{post.content}</p>

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">💬 Comments</h2>

        {loadingComments ? (
          <p>Loading comments…</p>
        ) : comments.length ? (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="p-4 bg-gray-100 rounded-md shadow-sm">
                <strong className="block text-gray-800">{c.user_name}</strong>
                <p className="text-gray-700 mt-1">{c.content}</p>
                <small className="text-gray-500">
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}

        {/* Add Comment Form */}
        <form onSubmit={submitComment} className="mt-8 space-y-3">
          <input
            className="border rounded-md p-2 w-full"
            placeholder="Your name"
            value={newComment.user_name}
            onChange={(e) =>
              setNewComment((c) => ({ ...c, user_name: e.target.value }))
            }
            required
          />
          <textarea
            className="border rounded-md p-2 w-full"
            placeholder="Your comment..."
            value={newComment.content}
            onChange={(e) =>
              setNewComment((c) => ({ ...c, content: e.target.value }))
            }
            required
          />
          <button
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Add Comment"}
          </button>
        </form>
      </div>

      {error && <div className="mt-6 text-red-600">{error}</div>}
    </div>
  );
}
