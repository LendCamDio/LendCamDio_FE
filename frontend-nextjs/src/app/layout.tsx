"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "../contexts/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "../contexts/react-query";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <AuthProvider>{children}</AuthProvider>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
