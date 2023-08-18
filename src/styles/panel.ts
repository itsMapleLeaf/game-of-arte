import { twMerge, type ClassNameValue } from "tailwind-merge"

export const panel = (...classes: ClassNameValue[]) =>
	twMerge(
		"bg-base-900 border-base-800 shadow-black/50 divide-base-800",
		...classes,
	)
