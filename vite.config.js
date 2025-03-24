import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/task-burrow/", // 👈 THIS is the key line
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "docs",
  },
  define: {
    "process.env": {},
  },
});
