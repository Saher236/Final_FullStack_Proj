// client/src/components/user/UserSkillsPage.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import UserSectionNav from "./UserSectionNav";

export default function UserSkillsPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profiles/user/${userId}`)
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const skills = useMemo(() => {
    const raw = profile?.skills;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((s) => String(s).trim());
    return String(raw).split(",").map((s) => s.trim());
  }, [profile]);

  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-6xl mx-auto px-6 py-10">
        <UserSectionNav userId={userId} active="skills" />

        <h1 className="text-3xl font-bold mb-6">Skills</h1>

        {loading && <p>Loading…</p>}
        {!loading && (
          skills.length ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills yet.</p>
          )
        )}
      </div>
    </div>
  );
}
