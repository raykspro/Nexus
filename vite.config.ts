import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

// Recriação do __dirname para compatibilidade total com o Linux do GitHub Actions
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // Base sincronizada para o repositório Nexus
  base: "/Nexus/", 
  resolve: {
    alias: {
      // O alias "@" é vital para as importações limpas nos componentes que faremos
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  }
});
