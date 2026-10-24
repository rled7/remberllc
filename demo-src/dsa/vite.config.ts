import { defineConfig } from "vite";
import { cRunnerPlugin } from "./server/cRunnerPlugin";

// Relative asset paths so the built dist/ can be dropped into a subpath
// later (e.g. remberllc/public/demos/dsa/) without any base-path config.
export default defineConfig({
  base: "./",
  // cRunnerPlugin registers a dev-server-only middleware (apply: "serve");
  // it never ships in `vite build` output, same as the local Ollama features.
  plugins: [cRunnerPlugin()],
  // Allows testing `vite preview` through a temporary tunnel (e.g. a
  // *.trycloudflare.com quick tunnel) for real-device PWA install testing.
  preview: {
    allowedHosts: [".trycloudflare.com"],
  },
});
