// client/src/components/AboutPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";


/**
 * AboutPage
 * Displays information about all admins/users in the system.
 * Features:
 * - Fetches users from the API
 * - Shows avatar, name, username, and email (if available)
 */
export default function AboutPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      //.get("http://localhost:5000/api/users")
      .get("https://final-fullstack-proj.onrender.com/api/users")
      .then((r) => setUsers(r.data || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  
  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-6">About Us</h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Meet our team! Each admin brings unique skills and expertise.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {users.map((u) => (
            <div key={u.id} className="bg-white shadow-lg rounded-xl p-6 text-center hover-lift">
              <img
                src={u.avatar_url || "https://via.placeholder.com/150"}
                alt={u.first_name}
                className="rounded-full mx-auto mb-4 w-28 h-28 object-cover shadow-md"
              />
              <h5 className="text-xl font-semibold">
                {u.first_name} {u.last_name}
              </h5>
              <p className="text-gray-500">@{u.username}</p>
              <p className="mt-2">
                {u.email ? (
                  <a href={`mailto:${u.email}`} className="text-indigo-600 hover:underline">
                    {u.email}
                  </a>
                ) : (
                  <span className="text-gray-400">No public email</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
