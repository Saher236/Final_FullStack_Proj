// client/src/components/common/blog/BlogPostPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../api";

/**
 * BlogPostPage
 * Displays a single blog post.
 * Features:
 * - Loads post by slug from API
 * - Shows title, date, thumbnail, and content
 * - Back button returns to blog list
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  // Fetch post by slug
  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then((r) => setPost(r.data))
      .catch(console.error);
  }, [slug]);

  if (!post) return <div className="text-center py-20">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        ← Back to Blogs
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-3">{post.title}</h1>

      {/* Date */}
      <div className="text-gray-500 text-sm mb-6">
        {new Date(post.created_at).toLocaleString()}
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <img
          className="w-full max-h-[600px] rounded-lg mb-6 shadow-md object-contain mx-auto"
          src={post.thumbnail}
          alt={post.title}
        />
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        {post.content}
      </div>
    </div>
  );
}
