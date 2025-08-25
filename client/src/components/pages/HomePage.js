// client/src/components/HomePage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { api } from "../api";

/**
 * HomePage
 * Landing page of the portfolio site.
 * Features:
 * - Hero section with welcome message
 * - Team section showing all users with links to their portfolios
 */
export default function HomePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users`)
      .then((r) => setUsers(r.data || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="p-5 mb-5 bg-light rounded-3 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-3 text-center">
            <img
              src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
              alt="Avatar"
              className="rounded-circle img-fluid shadow"
              style={{ maxWidth: 160 }}
            />
          </div>
          <div className="col-md-9">
            <h1 className="fw-bold">🚀 Welcome</h1>
            <p className="lead text-muted">
              Explore skills, projects, and journeys of passionate developers.  
              Built with ❤️ using React + Node.js.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <h2 id="team" className="mb-4 text-center fw-bold">
        👨‍💻 Our Team
      </h2>
      <div className="row">
        {users.map((u) => (
          <div className="col-md-6 mb-4" key={u.id}>
            <div className="card p-4 text-center border-0 shadow-lg h-100 team-card">
              <img
                src={u.avatar_url || "https://via.placeholder.com/150"}
                alt={`${u.first_name} ${u.last_name}`}
                className="rounded-circle mx-auto mb-3 shadow-sm"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
              <h5 className="fw-bold">
                {u.first_name} {u.last_name}
              </h5>
              <div className="text-muted">@{u.username}</div>

              {/* Links */}
              <div className="d-flex justify-content-center gap-3 mt-3">
                {u.github_url && (
                  <a
                    href={u.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-dark btn-sm px-3"
                  >
                    GitHub
                  </a>
                )}
                {u.linkedin_url && (
                  <a
                    href={u.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm px-3"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              {/* Portfolio button */}
              <div className="mt-4 d-grid">
                <Link
                  className="btn btn-success fw-semibold"
                  to={`/user/${u.id}`}
                >
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>
        ))}
        {!users.length && (
          <p className="text-center text-muted">No team members yet.</p>
        )}
      </div>
    </div>
  );
}
