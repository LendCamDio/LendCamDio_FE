import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/googleAuth.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./contexts/react-query.ts";
import AuthProvider from "./contexts/AuthProvider.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { BookingProvider } from "./contexts/BookingContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <CartProvider>
            <BookingProvider>
              <App />
            </BookingProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
