import { type Config } from "tailwindcss"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import { type KeyValuePair } from "tailwindcss/types/config"

export default {
	content: ["./src/**/*.{ts,tsx}", "./index.html"],
	theme: {
		extend: {
			colors: {
				base: colors.zinc,
				accent: colors.emerald,
				error: colors.red,
			},
			minWidth: (utils) => utils.theme("width") as KeyValuePair,
			maxWidth: (utils) => utils.theme("width") as KeyValuePair,
			minHeight: (utils) => utils.theme("height") as KeyValuePair,
			maxHeight: (utils) => utils.theme("height") as KeyValuePair,
		},
	},
	plugins: [
		plugin(function customPreflight(api) {
			api.addBase({
				button: {
					"text-align": "left",
				},
			})
		}),
		plugin(function size(api) {
			api.matchUtilities(
				{ s: (value: string) => ({ width: value, height: value }) },
				{ values: { ...api.theme("width"), ...api.theme("height") } },
			)
		}),
		plugin(function ariaCurrentPage(api) {
			api.addVariant("aria-current-page", '&[aria-current="page"]')
		}),
	],
} satisfies Config
