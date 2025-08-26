// client/src/components/user/UserAboutPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserSectionNav from "./UserSectionNav";

export default function UserAboutPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`https://final-fullstack-proj.onrender.com/api/profiles/user/${userId}`)
      .then((r) => setProfile(r.data))
      .catch(console.error);
  }, [userId]);

  if (!profile) return <div className="max-w-5xl mx-auto px-6 py-10">Loading…</div>;

  const age = profile.birth_year
    ? new Date().getFullYear() - profile.birth_year
    : null;

  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-6xl mx-auto px-6 py-10">
        <UserSectionNav userId={userId} active="about" />

        <h1 className="text-3xl font-bold mb-6">About Me</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>{profile.about || "No about info yet."}</p>
          {age && <p><strong>Age:</strong> {age}</p>}
          {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
          {profile.languages && <p><strong>Languages:</strong> {profile.languages}</p>}
        </div>
      </div>
    </div>
  );
}
