// client/src/components/SkillsPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * SkillsPage
 * Shows skills for each admin/user.
 * Features:
 * - Fetches all users and their skills
 * - Displays skills as badges under each user
 */
export default function SkillsPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios
      // .get("http://localhost:5000/api/users")
      .get("https://final-fullstack-proj.onrender.com/api/users")
      .then(async (res) => {
        const users = res.data || [];
        const skillsData = await Promise.all(
          users.map(async (u) => {
            const r = await axios.get(
              `http://final-fullstack-proj.onrender.com/api/profiles/user/${u.id}/skills`
            );
            return { ...u, skills: r.data.skills || [] };
          })
        );
        setProfiles(skillsData);
      })
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4">Skills</h1>
      <p className="lead">
        Here are the main tools and technologies we work with:
      </p>
      <div className="row mt-4">
        {profiles.map((p) => (
          <div key={p.id} className="col-md-6 mb-4">
            <div className="card shadow-sm p-3 h-100">
              <h5>
                {p.first_name} {p.last_name}
              </h5>
              <div className="mt-2 d-flex flex-wrap gap-2">
                {p.skills.length > 0 ? (
                  p.skills.map((s, i) => (
                    <span key={i} className="badge bg-dark">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
