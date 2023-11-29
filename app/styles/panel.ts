import { type ClassNameValue, twMerge } from "tailwind-merge"

export const panel = (...classes: ClassNameValue[]) =>
	twMerge(
		"divide-base-800 border-base-800 bg-base-900 shadow-black/50",
		...classes,
	)
