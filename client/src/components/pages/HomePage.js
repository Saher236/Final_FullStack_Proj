  // client/src/components/pages/HomePage.js

  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import axios from "axios";

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
        .get("https://final-fullstack-proj.onrender.com/api/users")
        .then((r) => setUsers(r.data || []))
        .catch((err) => console.error("Error fetching users:", err));
    }, []);

    return (
    <div className="min-h-screen relative animated-bg">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="relative glass-effect rounded-2xl p-12 text-center shadow-lg">
          <h1 className="text-5xl font-extrabold mb-6 primary-gradient animate-fade-in">
            🚀 Welcome To Our Website
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Explore skills, projects, and journeys of passionate developers.  
            Built with ❤️ using React + Node.js.
          </p>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/40 to-purple-600/40 blur-xl -z-10"></div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-center mb-12">👨‍💻 Our Team</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-[2px] rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transform transition"
            >
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg h-full flex flex-col justify-between">
                <div>
                  <img
                    src={u.avatar_url || "https://via.placeholder.com/150"}
                    alt={`${u.first_name} ${u.last_name}`}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover shadow-md"
                  />
                  <h5 className="text-xl font-semibold">
                    {u.first_name} {u.last_name}
                  </h5>
                  <div className="text-gray-500">@{u.username}</div>
                </div>

                {/* Links */}
                <div className="flex justify-center gap-3 mt-6">
                  {u.github_url && (
                    <a
                      href={u.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
                    >
                      GitHub
                    </a>
                  )}
                  {u.linkedin_url && (
                    <a
                      href={u.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Portfolio Button */}
                <div className="mt-6">
                  <Link
                    className="w-full block bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-medium"
                    to={`/user/${u.id}`}
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {!users.length && (
            <p className="text-center text-gray-500 col-span-full">
              No team members yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}