import { type ClassNameValue, twMerge } from "tailwind-merge"

export const twStyle = (...classes: ClassNameValue[]) =>
	twMerge.bind(null, classes)
