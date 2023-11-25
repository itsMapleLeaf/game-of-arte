import { type ClassNameValue, twMerge } from "tailwind-merge"

export type TwStyle = (...classes: ClassNameValue[]) => string
export const twStyle = (...classes: ClassNameValue[]) =>
	twMerge.bind(null, classes)
