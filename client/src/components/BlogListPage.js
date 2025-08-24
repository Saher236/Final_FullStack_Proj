// client/src/components/BlogListPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function BlogListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then(r => setPosts(r.data)).catch(console.error);
  }, []);

//   return (
//     <div className="container my-5">
//       <h1 className="text-center mb-4">
//         <i className="bi bi-journal-text me-2"></i> Our Blogs
//       </h1>
//       <p className="text-muted text-center mb-5">
//         Discover our latest articles, tutorials, and thoughts on software development, design, and technology.
//       </p>

//       <div className="row">
//         {posts.map(p => (
//           <div className="col-md-6 col-lg-4 mb-4" key={p.id}>
//             <div className="card shadow-sm h-100">
//               {/* ✅ Show blog image */}
//               {p.cover_image_url ? (
//                 <img
//                   src={p.cover_image_url}
//                   alt={p.title}
//                   className="card-img-top"
//                   style={{ height: "200px", objectFit: "cover" }}
//                 />
//               ) : (
//                 <div
//                   className="bg-light d-flex align-items-center justify-content-center"
//                   style={{ height: "200px" }}
//                 >
//                   <span className="text-muted">No image available</span>
//                 </div>
//               )}

//               <div className="card-body d-flex flex-column">
//                 <h5 className="card-title">{p.title}</h5>
//                 <div className="text-muted mb-2">
//                   {new Date(p.created_at).toLocaleDateString()}
//                 </div>
//                 <p className="card-text text-truncate">
//                   {p.preview || "No preview available."}
//                 </p>
//                 <div className="mt-auto">
//                   <Link className="btn btn-primary w-100" to={`/blog/${p.slug}`}>
//                     Read More →
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {!posts.length && <p>No posts yet.</p>}
//       </div>
//     </div>
//   );
// }

 return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">📖 Our Blogs</h1>
      <p className="text-center text-muted mb-5">
        Discover our latest articles, tutorials, and thoughts on software development, design, and technology.
      </p>

      <div className="row">
        {posts.map(p => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm">
              {/* תמונה בראש הכרטיס */}
              {/* {p.thumbnail ? (
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light text-muted"
                  style={{ height: "180px" }}
                >
                  No image available
                </div>
              )} */}

              {p.thumbnail ? (
                <img src={p.thumbnail} className="card-img-top" alt={p.title} style={{ height: "200px", objectFit: "cover" }} />
              ) : (
                <div className="text-muted text-center py-5">No image available</div>
              )}
              
              {/* גוף הכרטיס */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="text-muted small">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
                <p className="card-text flex-grow-1">
                  {p.content?.slice(0, 100) || "No preview available."}...
                </p>
                <Link className="btn btn-primary mt-auto" to={`/blog/${p.slug}`}>
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {!posts.length && <p className="text-center">No blog posts yet.</p>}
      </div>
    </div>
  );
}