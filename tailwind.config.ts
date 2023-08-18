import { Config } from "tailwindcss"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

export default {
	content: ["./src/**/*.{html,js,svelte,ts}", "./index.html"],
	theme: {
		extend: {
			colors: {
				base: colors.gray,
				accent: colors.emerald,
				error: colors.red,
			},
			minWidth: (utils) => utils.theme("width"),
			maxWidth: (utils) => utils.theme("width"),
			minHeight: (utils) => utils.theme("height"),
			maxHeight: (utils) => utils.theme("height"),
		},
	},
	plugins: [
		plugin(function size(api) {
			api.matchUtilities(
				{ s: (value) => ({ width: value, height: value }) },
				{ values: { ...api.theme("width"), ...api.theme("height") } },
			)
		}),
		plugin(function ariaCurrentPage(api) {
			api.addVariant("aria-current-page", '&[aria-current="page"]')
		}),
	],
} satisfies Config
