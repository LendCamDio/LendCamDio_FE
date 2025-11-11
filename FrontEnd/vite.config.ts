import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      usePolling: false,
    },
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "axios",
      "framer-motion",
    ],
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
