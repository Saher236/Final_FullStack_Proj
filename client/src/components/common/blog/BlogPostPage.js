// client/src/components/BlogPostPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api";

/**
 * BlogPostPage
 * Displays a single blog post.
 * Features:
 * - Loads post by slug from API
 * - Shows title, date, thumbnail, and full content
 */
export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  // Fetch post by slug
  useEffect(() => {
    api.get(`/posts/${slug}`).then((r) => setPost(r.data)).catch(console.error);
  }, [slug]);

  if (!post) return <div className="container my-5">Loading…</div>;

  return (
    <div className="container my-5">
      <h1>{post.title}</h1>
      <div className="text-muted mb-3">
        {new Date(post.created_at).toLocaleString()}
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <img
          className="img-fluid mb-3 rounded"
          src={post.thumbnail}
          alt={post.title}
        />
      )}

      <p>{post.content}</p>
    </div>
  );
}
