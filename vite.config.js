import { unstable_vitePlugin as remix } from "@remix-run/dev"
import million from "million/compiler"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { defaultExclude } from "vitest/config"

export default defineConfig({
	plugins: [
		million.vite({ auto: true }),
		remix({
			future: {
				v3_fetcherPersist: true,
			},
		}),
		tsconfigPaths(),
		// forgetti({
		// 	preset: "react",
		// 	filter: {
		// 		include: "app/**/*.tsx",
		// 		exclude: "node_modules/**",
		// 	},
		// }),
	],
	server: { port: 3000 },
	test: {
		includeSource: ["app/**/*.{ts,tsx}"],
		exclude: [...defaultExclude, "tests"],
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
