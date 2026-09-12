import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { jawaPlugin } from "./plugins/vite-plugin-jawa.js"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), jawaPlugin()],
})