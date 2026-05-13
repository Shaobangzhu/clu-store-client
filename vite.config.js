import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import eslint from "vite-plugin-eslint";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createAlias = (dirName) => path.resolve(__dirname, "src", dirName);
// components => /项目根目录/src/components

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      fastRefresh: true,
    }),
    eslint(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": createAlias(""), // src/, 项目根目录
      "@components": createAlias("components"), // src/components/, 组件专用通道
      "~img": createAlias("assets/images"), // src/assets/images/, 图片专用通道
      "#types": createAlias("types"), // src/types/, TS类型定义目录
    },
  },
});
