import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { viteSingleFile } from "vite-plugin-singlefile";
import vitePluginString from "vite-plugin-string";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui-src",
  plugins: [
    reactRefresh(), 
    viteSingleFile(),
    vitePluginString({
      include: ['**/*.csv'],
    })
  ],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: "../dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});