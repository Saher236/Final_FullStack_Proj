// src/components/UserPortfolioPage.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import UserSectionNav from './UserSectionNav';

export default function UserPortfolioPage() {
  const { userId } = useParams();
  const [resume, setResume] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/resumes/user/${userId}`)
      .then(r => setResume(r.data))
      .catch(() => {});

    axios
      .get(`http://localhost:5000/api/projects/user/${userId}`)
      .then(r => setProjects(r.data || []))
      .catch(() => {});
  }, [userId]); 

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="portfolio" />

      <h1>Portfolio & Resume</h1>

      <h4 className="mt-4">Resume</h4>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{resume?.content || '—'}</pre>
      {resume && (
        <a
          className="btn btn-outline-primary"
          href={`http://localhost:5000/api/resumes/user/${userId}/pdf`}
          target="_blank"
          rel="noreferrer"
        >
          Download PDF
        </a>
      )}

      <h4 className="mt-4">Projects</h4>
      <div className="row">
        {projects.map(p => (
          <div className="col-md-6 mb-3" key={p.id}>
            <div className="card p-3">
              <h5>{p.title}</h5>
              <p className="text-muted">{p.description}</p>
              <div className="d-flex gap-2">
                {p.github_link && (
                  <a
                    className="btn btn-sm btn-outline-dark"
                    href={p.github_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                )}
                {p.demo_link && (
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={p.demo_link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Live
                  </a>
                )}
                <Link
                  className="btn btn-sm btn-primary ms-auto"
                  to={`/user/${userId}/projects/${p.id}`}
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!projects.length && <p>No projects yet.</p>}
      </div>
    </div>
  );
}
