import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.248:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/login": {
        target: "http://192.168.1.248:8080",
        changeOrigin: true,
        secure: false,
      },
      "/domain-list": {
        target: "http://192.168.1.248:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
