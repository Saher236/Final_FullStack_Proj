// client/src/components/user/UserBlogListPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api";
import UserSectionNav from "./UserSectionNav";

export default function UserBlogListPage() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get(`/posts/user/${userId}`)
      .then((res) => setPosts(res.data || []))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <UserSectionNav userId={userId} active="blog" />

      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {p.thumbnail ? (
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="max-h-full max-w-full object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                No image
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h5 className="text-lg font-bold">{p.title}</h5>
              <p className="text-gray-500 text-sm">{new Date(p.created_at).toLocaleDateString()}</p>
              <p className="text-gray-700 flex-grow mt-2">
                {p.content?.slice(0, 120) || "No preview available."}...
              </p>
              <Link
                to={`/blog/${p.slug}`}
                className="mt-4 inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
        {!posts.length && <p className="text-gray-500 col-span-full">No posts yet.</p>}
      </div>
    </div>
  );
}
