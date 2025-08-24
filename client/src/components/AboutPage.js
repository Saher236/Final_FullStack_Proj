// client/src/components/AboutPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(r => setUsers(r.data || []))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4">About Us</h1>
      <p className="lead">
        👋 Meet our team! Each admin brings a unique background, passion, and
        expertise in software development. Here’s a little more about who we are.
      </p>
      <div className="row mt-4">
        {users.map(u => (
          <div key={u.id} className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100 text-center">
              <img
                src={u.avatar_url || "https://via.placeholder.com/150"}
                alt={u.first_name}
                className="rounded-circle mx-auto mb-3"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
              <h5>{u.first_name} {u.last_name}</h5>
              <p className="text-muted">@{u.username}</p>
              <p>
                {u.email ? (
                  <a href={`mailto:${u.email}`}>{u.email}</a>
                ) : "No public email"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}