import { tailwindExtensions } from "@itsmapleleaf/configs/tailwind"
import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

export default {
	content: ["./src/**/*.{ts,tsx}", "./index.html"],
	presets: [tailwindExtensions],
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
	],
} satisfies Config
