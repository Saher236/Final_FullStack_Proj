// client/src/components/user/UserPortfolioPage.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import UserSectionNav from "./UserSectionNav";

export default function UserPortfolioPage() {
  const { userId } = useParams();
  const [resume, setResume] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`https://final-fullstack-proj.onrender.com/api/resumes/user/${userId}`)
      .then((r) => setResume(r.data))
      .catch(() => {});
    axios
      .get(`https://final-fullstack-proj.onrender.com/api/projects/user/${userId}`)
      .then((r) => setProjects(r.data || []))
      .catch(() => {});
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <UserSectionNav userId={userId} active="portfolio" />

      <h1 className="text-3xl font-bold mb-6">Portfolio & Resume</h1>

      {/* Resume */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-2">📄 Resume</h4>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md shadow-sm">
          {resume?.content || "—"}
        </pre>
        {resume && (
          <a
            className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            href={`https://final-fullstack-proj.onrender.com/api/resumes/user/${userId}/pdf`}
            target="_blank"
            rel="noreferrer"
          >
            Download PDF
          </a>
        )}
      </div>

      {/* Projects */}
      <h4 className="text-xl font-semibold mb-4">💻 Projects</h4>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-white shadow-md rounded-lg p-5 flex flex-col">
            <h5 className="text-lg font-bold">{p.title}</h5>
            <p className="text-gray-600 mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {p.github_link && (
                <a
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                  href={p.github_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              )}
              {p.demo_link && (
                <a
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500"
                  href={p.demo_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live
                </a>
              )}
              <Link
                to={`/user/${userId}/projects/${p.id}`}
                className="ml-auto px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500"
              >
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!projects.length && <p className="text-gray-500 mt-6">No projects yet.</p>}
    </div>
  );
}
