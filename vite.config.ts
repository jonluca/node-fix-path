import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    threads: true,
    isolate: true,
    reporters: "verbose",
  },
  esbuild: {
    target: "node10",
  },
});
