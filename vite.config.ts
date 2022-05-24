/// <reference types="vitest" />

import { ViteAngularPlugin } from "@nxext/angular-vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  root: "src",
  plugins: [
    ViteAngularPlugin({
      target: "es2020",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["test-setup.ts"],
    includeSource: ["**/*.{js,ts}"],
  },
  resolve: {
    mainFields: ["fesm2020", "fesm2015", "module"],
  },
  define: {
    "import.meta.vitest": mode !== "production",
  },
}));
