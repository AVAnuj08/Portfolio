import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4174",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (_error, _request, response) => {
            if (!response.headersSent) {
              response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
            }
            response.end(
              JSON.stringify({
                message: "Contact API is not running. Start it with npm run serve in another terminal.",
              })
            );
          });
        },
      },
    },
  },
});
