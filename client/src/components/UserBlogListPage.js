// client/src/components/UserBlogListPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import UserSectionNav from "./UserSectionNav";

export default function UserBlogListPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    api
      .get(`/posts/user/${userId}`)
      .then((res) => setPosts(res.data))
      .catch((e) => {
        console.error(e);
        setErr("Failed to load posts");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="blog" />
      <h1 className="mb-4">Blog</h1>

      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="row g-4">
        {posts.map((p) => (
          <div key={p.id} className="col-md-6">
            <div className="card h-100 shadow-sm d-flex flex-column">
              {/* Thumbnail */}
              <img
                src={
                  p.thumbnail ||
                  "https://via.placeholder.com/400x200?text=No+Image"
                }
                alt={p.title}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="text-muted mb-2">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>

                {/* Content preview */}
                <p className="card-text flex-grow-1">
                  {p.content
                    ? p.content.length > 120
                      ? p.content.substring(0, 120) + "..."
                      : p.content
                    : "No preview available..."}
                </p>

                {/* Read More button */}
                <Link
                  className="btn btn-primary mt-auto w-100"
                  to={`/blog/${p.slug}`}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !err && !posts.length && <p>No posts yet.</p>}
    </div>
  );
}
