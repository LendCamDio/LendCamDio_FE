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
  build: {
    sourcemap: false, // Disable source maps to prevent warnings
  },
  optimizeDeps: {
    exclude: ["lucide-react"], // Skip pre-bundling for lucide-react
  },
});
