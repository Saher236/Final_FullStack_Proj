// src/components/UserAboutPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserSectionNav from "./UserSectionNav";

/**
 * UserAboutPage
 * Shows the "About Me" section of a specific user.
 * Features:
 * - Fetches user profile from API
 * - Calculates age from birth year
 * - Displays about text, location, and spoken languages
 */
export default function UserAboutPage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/profiles/user/${userId}`)
      .then((r) => setProfile(r.data))
      .catch(console.error);
  }, [userId]);

  if (!profile) return <div className="container my-5">Loading…</div>;

  const age = profile.birth_year
    ? new Date().getFullYear() - profile.birth_year
    : null;

  const languages = Array.isArray(profile.languages)
    ? profile.languages
    : typeof profile.languages === "string"
    ? profile.languages.split(",")
    : [];

  return (
    <div className="container my-5">
      <UserSectionNav userId={userId} active="about" />
      <h1>About Me</h1>
      <p>{profile.about || "No about info yet."}</p>

      <div className="mt-3">
        {age && <p><strong>Age:</strong> {age}</p>}
        {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
        {languages.length > 0 && (
          <p><strong>Languages:</strong> {languages.join(", ")}</p>
        )}
      </div>
    </div>
  );
}