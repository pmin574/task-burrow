import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Ensures a predictable development port
  },
  build: {
    outDir: "dist",
  },
  // Ensuring Vite serves index.html for unknown routes (for client-side routing)
  define: {
    "process.env": {},
  },
});
