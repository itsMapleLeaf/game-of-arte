import { twMerge, type ClassNameValue } from "tailwind-merge"

export const panel = (...classes: ClassNameValue[]) =>
	twMerge(
		"bg-base-800 border border-base-700 rounded-md shadow-md shadow-black/25 divide-base-700",
		...classes,
	)
