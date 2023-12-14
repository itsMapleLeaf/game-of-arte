import { createTV } from "tailwind-variants"

const isInteger = (classPart: string) => /^\d+$/.test(classPart)

const isArbitraryValue = (classPart: string) => /^\[.+\]$/.test(classPart)

export const twVariants = createTV({
	twMergeConfig: {
		classGroups: {
			"grid-cols": [
				{
					"fluid-cols": [isInteger, isArbitraryValue],
				},
			],
			"fluid-cols-repeat-mode": [
				{
					"fluid-cols": ["auto-fill", "auto-fit"],
				},
			],
		},
	},
})
