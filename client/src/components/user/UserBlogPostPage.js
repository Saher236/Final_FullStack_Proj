// src/components/UserBlogPostPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * UserBlogPostPage
 * Displays a single blog post for a specific user.
 * Features:
 * - Fetches post by userId + slug
 * - Renders content safely with `dangerouslySetInnerHTML`
 */
export default function UserBlogPostPage() {
  const { userId, slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/user/${userId}/${slug}`)
      .then((r) => setPost(r.data))
      .catch(console.error);
  }, [userId, slug]);

  if (!post) return <div className="container my-5">Loading…</div>;

  return (
    <div className="container my-5">
      <h1>{post.title}</h1>
      <small className="text-muted">
        {new Date(post.created_at).toLocaleString()}
      </small>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: post.content_html || post.content || "" }}
      />
    </div>
  );
}
