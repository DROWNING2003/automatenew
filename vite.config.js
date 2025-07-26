import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    optimizeDeps: {
    exclude: ['path'] // 防止Vite外部化path模块
  }
});
