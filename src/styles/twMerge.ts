import { extendTailwindMerge } from "tailwind-merge"

type AdditionalClassGroupIDs = "fluid-cols-repeat-mode"

const isInteger = (classPart: string) => /^\d+$/.test(classPart)

const isArbitraryValue = (classPart: string) => /^\[.+\]$/.test(classPart)

export const twMerge = extendTailwindMerge<AdditionalClassGroupIDs>({
	extend: {
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
