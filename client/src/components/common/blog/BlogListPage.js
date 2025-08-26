// // client/src/components/common/blog/BlogListPage.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../api";

/**
 * BlogListPage
 * Displays all blog posts in a grid layout.
 * Features:
 * - Loads posts from API
 * - Shows title, date, short preview, and thumbnail if available
 * - Provides link to the full post
 */
export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  // Fetch all posts on mount
  useEffect(() => {
    api.get("/posts").then((r) => setPosts(r.data)).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-center mb-4">📖 Our Blogs</h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Discover our latest articles, tutorials, and thoughts on software
        development, design, and technology.
      </p>

      {/* Blog Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition hover-lift flex flex-col"
          >
          {/* Thumbnail */}
          {p.thumbnail ? (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="max-h-full max-w-full object-contain rounded-md"
              />
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-100">
              No image available
            </div>
          )}


            {/* Post Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-500 text-sm mb-3">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 flex-grow mb-4">
                {p.content?.slice(0, 100) || "No preview available."}...
              </p>
              <Link
                to={`/blog/${p.slug}`}
                className="mt-auto inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}

        {!posts.length && (
          <p className="text-center text-gray-500 col-span-full">
            No blog posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
