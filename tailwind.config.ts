import { Config } from "tailwindcss"
import colors from "tailwindcss/colors"

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			colors: {
				base: colors.gray,
				accent: colors.emerald,
				error: colors.red,
			},
			maxWidth: ({ theme }) => theme("width"),
		},
	},
	plugins: [],
} satisfies Config
