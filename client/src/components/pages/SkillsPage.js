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
              `https://final-fullstack-proj.onrender.com/api/profiles/user/${u.id}/skills`
            );
            return { ...u, skills: r.data.skills || [] };
          })
        );
        setProfiles(skillsData);
      })
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);

  return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-6">Skills</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Here are the main tools and technologies we work with:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profiles.map((p) => (
            <div key={p.id} className="bg-white shadow-lg rounded-xl p-6 hover-lift">
              <h5 className="text-xl font-semibold mb-4">
                {p.first_name} {p.last_name}
              </h5>
              <div className="flex flex-wrap gap-2">
                {p.skills.length > 0 ? (
                  p.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No skills listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}