import { twMerge, type ClassNameValue } from "tailwind-merge"

export const row = (...classes: ClassNameValue[]) =>
	twMerge("grid auto-cols-fr grid-flow-col gap-3", ...classes)

export const column = (...classes: ClassNameValue[]) =>
	twMerge("grid content-start gap-4", ...classes)

export const sectionHeading = (...classes: ClassNameValue[]) =>
	twMerge("border-b border-base-800 text-2xl font-light pb-1", ...classes)
