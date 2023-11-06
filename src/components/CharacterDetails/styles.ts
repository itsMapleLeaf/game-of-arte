import type { ClassNameValue } from "tailwind-merge"
import { twMerge } from "../../styles/twMerge.ts"

export const row = (...classes: ClassNameValue[]) =>
	twMerge("grid gap-3 fluid-cols-auto-fit fluid-cols-24", ...classes)

export const column = (...classes: ClassNameValue[]) =>
	twMerge("grid content-start gap-4", ...classes)

export const sectionHeading = (...classes: ClassNameValue[]) =>
	twMerge("border-b border-base-800 pb-1 text-2xl font-light", ...classes)
