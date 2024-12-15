/**
 * @file Vite configuration file
 */
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

export default defineConfig({
    publicDir: "public",
    root: "src",
    server: {
        port: 8080,
    },
    // outDir: "../dist",
    build: {
        outDir: "../dist",
    },
    // Github Pages
    // base: "/",
    plugins: [
        // react(),
        // tailwindcss(),
        // htmlTemplate({
        //     template: "public/index.html",
        //     inject: {
        //         injectTo: "head",
        //         data: {
        //             title: "Quantum Assembler",
        //         },
        //     },
        // }),
    ],
    // css: {
    //     postcss: {
    //         plugins: [tailwindcss()],
    //     },
    // }
    // esbuild: false,
});
