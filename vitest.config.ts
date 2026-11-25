import { defineConfig } from "vitest/config";

// テストは画面と切り離したロジック（src/shared）だけを対象にする
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
