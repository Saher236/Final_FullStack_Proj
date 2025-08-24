// client/src/components/BlogPostPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/slug/${slug}`).then(r => setPost(r.data)).catch(console.error);
  }, [slug]);

  if (!post) return <div className="container my-5">Loading…</div>;

  return (
    <div className="container my-5">
      <h1>{post.title}</h1>
      <div className="text-muted mb-3">{new Date(post.created_at).toLocaleString()}</div>
      {post.cover_image_url && <img className="img-fluid mb-3" src={post.cover_image_url} alt={post.title} />}
      <p>{post.content}</p>
    </div>
  );
}




