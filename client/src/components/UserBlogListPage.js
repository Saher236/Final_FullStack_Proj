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
    api.get(`/posts/user/${userId}`)
      .then(res => setPosts(res.data))
      .catch(e => { console.error(e); setErr("Failed to load posts"); })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="blog" />
      <h1>Blog</h1>

      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="row g-3">
        {posts.map(p => (
          <div key={p.id} className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="text-muted mb-3">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
                <Link className="btn btn-primary w-100" to={`/blog/${p.slug}`}>
                  Read More
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
