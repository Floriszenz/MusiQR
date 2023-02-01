import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            manifest: {
                name: "MusiQR",
                short_name: "MusiQR",
                description: "Turn QR codes into music 🎶",
                theme_color: "#f8fafc",
                background_color: "#f8fafc",
                display: "standalone",
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                protocol_handlers: [
                    {
                        protocol: "web+mqr",
                        url: "/play?song=%s",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,svg,ogg}"],
                globIgnores: ["**/node_modules/**/*", "server/**/*"],
                navigateFallbackDenylist: [/^\/play/],
            },
        }),
    ],
});
