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
      outDir: "../dist-sandbox",
    },
    define: {
      "import.meta.env.VITE_MAPBOX_ACCESS_TOKEN": JSON.stringify(env.VITE_MAPBOX_ACCESS_TOKEN),
      "import.meta.env.VITE_MUI_LICENSE_KEY": JSON.stringify(env.VITE_MUI_LICENSE_KEY),
    },
    plugins: [react()],
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "src") },
        { find: "sandbox", replacement: resolve(__dirname, "sandbox") }, // ✅ MAJ alias
      ],
    },
    root: "sandbox",
    server: {
      port: 5174,
    },
  };
});
