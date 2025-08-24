// client/src/components/BlogListPage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then(r => setPosts(r.data)).catch(console.error);
  }, []);

  return (
    <div className="container my-5">
      <h1>Blog</h1>
      <div className="row">
        {posts.map(p => (
          <div className="col-md-6 mb-3" key={p.id}>
            <div className="card p-3">
              <h5>{p.title}</h5>
              <div className="text-muted">{new Date(p.created_at).toLocaleDateString()}</div>
              <Link className="btn btn-primary mt-2" to={`/blog/${p.slug}`}>Read More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
