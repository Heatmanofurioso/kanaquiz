import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import autoprefixer from "autoprefixer";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";

const targets = [">0.10%", "not dead"];

// https://vitejs.dev/config/
export default ({ mode }) => {
    console.log("running at: %s mode", mode);

    return defineConfig({
        plugins: [
            react({
                include: "**/*.{js,jsx}",
                jsxRuntime: "classic",
            }),
            legacy({
                targets,
            }),
            VitePWA({ registerType: "autoUpdate" }),
        ],
        css: {
            postcss: {
                plugins: [
                    tailwindcss,
                    autoprefixer,
                    ...(mode === "production" ? [cssnano] : []),
                ],
            },
        },
    });
};
