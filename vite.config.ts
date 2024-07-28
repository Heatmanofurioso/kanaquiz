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

    // Set base URL based on the mode
    const base = mode === 'production' ? '/kanaquiz/' : '/';

    return defineConfig({
        base: base, // Use the base URL based on the mode
        plugins: [
            react({
                include: "**/*.{js,jsx}",
                jsxRuntime: "automatic",
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