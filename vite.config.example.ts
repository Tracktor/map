// vite.config.example.ts
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  return {
    base: isProd ? "/map/" : "/",
    build: {
      chunkSizeWarningLimit: 1500,
      emptyOutDir: true,
      outDir: "../dist-example",
    },
    define: {
      "import.meta.env.VITE_MAPBOX_ACCESS_TOKEN": JSON.stringify(env.VITE_MAPBOX_ACCESS_TOKEN),
      "import.meta.env.VITE_MUI_LICENSE_KEY": JSON.stringify(env.VITE_MUI_LICENSE_KEY),
    },
    plugins: [react()],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "example", replacement: resolve(__dirname, "example") },
      ],
    },
    root: "example",
    server: {
      port: 5174,
    },
  };
});
