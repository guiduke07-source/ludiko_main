import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import GoogleFonts from "google-fonts";

GoogleFonts.add({
  "Baloo 2": ["400", "500", "600", "700", "800"],
  Roboto: ["400", "700"],
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);