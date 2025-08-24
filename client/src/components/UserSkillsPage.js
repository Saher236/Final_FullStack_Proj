// client/src/components/UserSkillsPage.js


import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import UserSectionNav from "./UserSectionNav";

export default function UserSkillsPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    api.get(`/profiles/user/${userId}`)
      .then(res => setProfile(res.data))
      .catch(e => { console.error(e); setErr("Failed to load skills"); })
      .finally(() => setLoading(false));
  }, [userId]);

  // תמיכה גם במחרוזת וגם במערך
  const skills = useMemo(() => {
    const raw = profile?.skills;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean);
    return String(raw).split(",").map(s => s.trim()).filter(Boolean);
  }, [profile]);

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="skills"  />
      <h1>Skills</h1>

      {loading && <p>Loading…</p>}
      {err && <div className="alert alert-danger">{err}</div>}
      {!loading && !err && (
        skills.length ? (
          <ul>{skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
        ) : <p>No skills yet.</p>
      )}
    </div>
  );
}
