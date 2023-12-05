import solid from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"
import viteConfig from "./vite.config.js"

export default defineConfig({
	integrations: [tailwind(), solid()],
	vite: viteConfig,
	server: {
		port: 3000,
	},
})
