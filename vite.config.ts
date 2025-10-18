import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-plugin-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
});
