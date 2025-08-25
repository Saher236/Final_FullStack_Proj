// client/src/index.js

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setAuthToken } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";

// Load token from localStorage if available so protected requests will work
setAuthToken(localStorage.getItem("token"));

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);