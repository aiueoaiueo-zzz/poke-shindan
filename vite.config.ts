import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  // 相対パスで書き出す（Cloudflare でも、ブラウザ確認用のプレビューでも同じビルドが動くように）
  base: "./",
  plugins: [react(), tailwindcss(), cloudflare()],
});
