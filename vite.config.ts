// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isTestMode = env.VITE_API_MODE === "test";
  const API_URL = isTestMode
    ? "http://localhost:3001"
    : env.VITE_API_URL || "http://192.168.1.248:8080";

  console.log("Mode:", mode);
  console.log("VITE_API_MODE:", env.VITE_API_MODE);
  console.log("VITE_API_URL:", env.VITE_API_URL);
  console.log("Resolved API_URL:", API_URL);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          secure: !isTestMode,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
