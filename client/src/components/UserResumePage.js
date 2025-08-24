// client/src/components/UserResumePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function UserResumePage() {
  const { userId } = useParams();
  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/resumes/user/${userId}`)
      .then(res => setResume(res.data))
      .catch(console.error);
  }, [userId]);

  if (!resume) return <div className="container my-5">No resume uploaded yet.</div>;

  return (
    <div className="container my-5">
      <h1>Resume</h1>
      {resume.pdfUrl ? (
        <iframe 
          src={resume.pdfUrl} 
          title="Resume PDF"
          width="100%" 
          height="600px" 
          style={{ border: 'none' }}
        />
      ) : (
        <p>No PDF uploaded yet.</p>
      )}
    </div>
  );
}
