import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import UserSectionNav from "./UserSectionNav";

export default function UserProjectsPage() {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/projects/user/${userId}`)
      .then(res => setProjects(res.data))
      .catch(err => { console.error(err); setError("Failed to load projects"); })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="container my-5">
      {/* <-- הניווט הפנימי כמו ב-About */}
      <UserSectionNav userId={userId} active="projects" />

      <h1>Projects</h1>
      {loading && <p>Loading…</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {projects.map(p => (
        <div key={p.id} className="card mb-3">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title mb-1">{p.title}</h5>
              <p className="card-text text-muted mb-2">{p.description}</p>
              <div className="btn-group">
                {p.github_link && (
                  <a className="btn btn-outline-primary btn-sm" href={p.github_link} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {p.demo_link && (
                  <a className="btn btn-outline-primary btn-sm" href={p.demo_link} target="_blank" rel="noreferrer">
                    Live
                  </a>
                )}
              </div>
            </div>

            {/* אם יש לך עמוד לפרויקט בודד, עדכן את הנתיב כאן: */}
            <Link to={`/user/${userId}/projects/${p.id}`} className="btn btn-primary btn-sm">
              Details
            </Link>
          </div>
        </div>
      ))}

      {!loading && !projects.length && <p>No projects yet.</p>}
    </div>
  );
}
