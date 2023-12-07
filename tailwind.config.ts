import { tailwindExtensions } from "@itsmapleleaf/configs/tailwind"
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

export default {
	content: ["./app/**/*.{ts,tsx}", "./index.html"],
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
			keyframes: (utils) => ({
				"flash-accent": {
					from: { color: utils.theme("colors.accent.400") },
				},
			}),
			animation: {
				"flash-accent": "flash-accent 1s",
			},
		},
	},
	plugins: [
		animate,

		plugin(function children(api) {
			api.addVariant("children", "& > *:not([hidden])")
		}),

		plugin(function scrollbar(api) {
			api.addVariant("scrollbar", "&::-webkit-scrollbar")
			api.addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb")
			api.addVariant("scrollbar-track", "&::-webkit-scrollbar-track")
			api.addVariant("scrollbar-corner", "&::-webkit-scrollbar-corner")
		}),

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
