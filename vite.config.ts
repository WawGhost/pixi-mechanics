import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/pixi-mechanics/" : "/",
  server: {
    port: 8080,
    open: true,
  },
}));
