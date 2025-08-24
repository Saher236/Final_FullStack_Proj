// client/src/index.js

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setAuthToken } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";

setAuthToken(localStorage.getItem("token"));

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// // טוען טוקן אם קיים כדי שהבקשות המוגנות יעבדו
// setAuthToken(localStorage.getItem("token") || null);

// const container = document.getElementById("root");
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );