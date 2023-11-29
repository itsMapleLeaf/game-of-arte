import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
			},
		}),
		tsconfigPaths(),
	],
	server: { port: 3000 },
	test: {
		includeSource: ["src/**/*.{ts,tsx}"],
	},
	define: {
		"import.meta.vitest": "undefined",
	},
	ssr: {
		noExternal: ["@clerk/clerk-react"],
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
