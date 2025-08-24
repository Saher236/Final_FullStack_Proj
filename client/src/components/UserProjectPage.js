// src/components/UserProjectPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import UserSectionNav from "./UserSectionNav";

export default function UserProjectPage() {
  const { userId, projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // אם אין לך endpoint לפרויקט בודד, אפשר להביא את רשימת המשתמש ולמצוא את הפרויקט:
    api.get(`/projects/user/${userId}`).then(res => {
      setProject(res.data.find(p => String(p.id) === String(projectId)) || null);
    });
  }, [userId, projectId]);

  if (!project) return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="projects" />
      <p>Loading…</p>
    </div>
  );

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="projects" />
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      {/* שאר פרטי הפרויקט */}
    </div>
  );
}

