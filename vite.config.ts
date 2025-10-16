import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import { version } from "./package.json";

let httpsConfig = {};

try {
   httpsConfig = {
      key: fs.readFileSync("./certs/localhost-key.pem"),
      cert: fs.readFileSync("./certs/localhost.pem")
   };
} catch (e) {
   console.warn("⚠️ Certificados SSL no encontrados, usando HTTP.");
}

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   define: {
      __APP_VERSION__: JSON.stringify(version)
   },
   server: {
      // https: httpsConfig,
      host: "localhost",
      port: 5173
   }
   //  server: {
   //     proxy: {
   //        "/api": "http://localhost:3000"
   //     }
   //  }
});
