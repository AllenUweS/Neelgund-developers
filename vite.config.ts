import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "./src/server.ts" },
    }),
    nitro({
      config: {
        preset: "vercel",
      },
    }),
    viteReact(),
  ],
  ssr: {
    noExternal: true,  // bundle ALL dependencies into SSR output
  },
});