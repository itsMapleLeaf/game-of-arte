import { tailwindExtensions } from "@itsmapleleaf/configs/tailwind"
import { mapValues, merge } from "lodash-es"
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"
import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

const vars = {
	colors: {
		backdrop: {
			DEFAULT: "--color-backdrop",
		},
		panel: {
			DEFAULT: "--color-panel",
			border: "--color-panel-border",
		},
		accent: {
			DEFAULT: "--color-accent",
		},
		error: {
			DEFAULT: "--color-error",
		},
	},
}

export default {
	content: ["./app/**/*.{ts,tsx}", "./index.html"],
	presets: [tailwindExtensions],
	theme: {
		extend: {
			fontFamily: {
				sans: `'Rubik Variable', sans-serif`,
			},
			colors: merge(
				mapValues(vars.colors, (variableRecord) =>
					mapValues(variableRecord, (variable) => `var(${variable})`),
				),
				{
					base: colors.zinc,
					accent: colors.emerald,
					error: colors.red,
				},
			),
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
		plugin(function theme(api) {
			api.addBase({
				":root": mapValues(vars.colors, (colors) =>
					mapValues(colors, (variable) => `var(${variable})`),
				),
			})
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

		plugin(function children(api) {
			api.addVariant("children", "& > *:not([hidden])")
		}),

		plugin(function scrollbar(api) {
			api.addVariant("scrollbar", "&::-webkit-scrollbar")
			api.addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb")
			api.addVariant("scrollbar-track", "&::-webkit-scrollbar-track")
			api.addVariant("scrollbar-corner", "&::-webkit-scrollbar-corner")
		}),

		animate,
	],
} satisfies Config
