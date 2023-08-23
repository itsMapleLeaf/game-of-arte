import { type Config } from "tailwindcss"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import { type KeyValuePair } from "tailwindcss/types/config"

export default {
	content: ["./src/**/*.{ts,tsx}", "./index.html"],
	theme: {
		extend: {
			fontFamily: {
				sans: `'Rubik Variable', sans-serif`,
			},
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
				":focus": {
					outline: "none",
				},
				":focus-visible": {
					"@apply ring-2 ring-accent-400 ring-inset": {},
				},
				button: {
					"text-align": "left",
				},
			})

			api.addUtilities({
				".ring-no-inset": {
					"--tw-ring-inset": "",
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
