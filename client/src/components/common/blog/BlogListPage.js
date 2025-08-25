// client/src/components/BlogListPage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api";

/**
 * BlogListPage
 * Displays all blog posts in a grid layout.
 * Features:
 * - Loads posts from API
 * - Shows title, date, short preview, and thumbnail if available
 * - Provides link to the full post
 */
export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  // Fetch all posts on mount
  useEffect(() => {
    api.get("/posts").then((r) => setPosts(r.data)).catch(console.error);
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">📖 Our Blogs</h1>
      <p className="text-center text-muted mb-5">
        Discover our latest articles, tutorials, and thoughts on software
        development, design, and technology.
      </p>

      <div className="row">
        {posts.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm">
              {/* Thumbnail */}
              {p.thumbnail ? (
                <img
                  src={p.thumbnail}
                  className="card-img-top"
                  alt={p.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <div className="text-muted text-center py-5">
                  No image available
                </div>
              )}

              {/* Post details */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="text-muted small">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
                <p className="card-text flex-grow-1">
                  {p.content?.slice(0, 100) || "No preview available."}...
                </p>
                <Link
                  className="btn btn-primary mt-auto"
                  to={`/blog/${p.slug}`}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {!posts.length && (
          <p className="text-center">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}
