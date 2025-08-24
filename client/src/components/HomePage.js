// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HomePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users').then(r => setUsers(r.data||[]));
  }, []);

  return (
    <div className="container my-5">
      {/* HERO */}
      <div className="row align-items-center mb-5">
        <div className="col-md-3 text-center">
          <img
            src="https://avatars.githubusercontent.com/u/9919?s=200&v=4" // החלף לאווטאר שלך
            alt="Avatar"
            className="rounded-circle img-fluid"
            style={{maxWidth: 160}}
          />
        </div>
        <div className="col-md-9">
          <h1>Welcome</h1>
          <p className="lead">Portfolio starter. הצגה קצרה עליך ועל תחומי ההתמחות.</p>

          {/* קישורים חיצוניים */}
          <div>
            <a href="https://github.com/username" target="_blank" rel="noreferrer" className="me-3">GitHub</a>
            <a href="https://www.linkedin.com/in/username" target="_blank" rel="noreferrer" className="me-3">LinkedIn</a>
            <a href="https://youtube.com/@channel" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      {/* TEAM */}
      <h2 className="mb-3">Our Team</h2>
      <div className="row">
        {users.map(u => (
          <div className="col-md-6 mb-3" key={u.id}>
            <div className="card p-3">
              <h5>{u.first_name} {u.last_name}</h5>
              <div className="text-muted">@{u.username}</div>
              <div className="mt-3 d-grid">
                <Link className="btn btn-primary" to={`/user/${u.id}`}>View Portfolio</Link>
              </div>
              <div className="mt-2 d-flex gap-2">
                <Link className="btn btn-outline-secondary btn-sm w-50" to={`/user/${u.id}/about`}>About</Link>
                <Link className="btn btn-outline-secondary btn-sm w-50" to={`/user/${u.id}/skills`}>Skills</Link>
              </div>
            </div>
          </div>
        ))}
        {!users.length && <p>No team members yet.</p>}
      </div>
    </div>
  );
}
