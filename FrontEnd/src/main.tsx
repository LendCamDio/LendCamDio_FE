import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/googleAuth.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
