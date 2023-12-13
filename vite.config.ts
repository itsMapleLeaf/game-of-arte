import mdx from "@mdx-js/rollup"
import { unstable_vitePlugin as remix } from "@remix-run/dev"
import tsconfigPaths from "vite-tsconfig-paths"
import { defaultExclude, defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
			},
		}),
		tsconfigPaths(),
		mdx(),
	],
	server: { port: 3000 },
	test: {
		includeSource: ["app/**/*.{ts,tsx}"],
		exclude: [...defaultExclude, "e2e"],
	},
	define: {
		"import.meta.vitest": "undefined",
	},
	build: {
		rollupOptions: {
			onwarn(warning, defaultHandler) {
				// ignore warnings for RSC directives
				if (
					warning.code === "MODULE_LEVEL_DIRECTIVE" &&
					warning.message.includes("use client")
				) {
					return
				}
				defaultHandler(warning)
			},
		},
	},
})
