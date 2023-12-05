import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { defaultExclude } from "vitest/config"

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		includeSource: ["src/**/*.{ts,tsx}"],
		exclude: [...defaultExclude, "tests"],
	},
	define: {
		"import.meta.vitest": "undefined",
	},
	ssr: {
		noExternal: ["@clerk/clerk-react"],
	},
})
