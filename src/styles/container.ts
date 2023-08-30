import { type ClassNameValue, twMerge } from "tailwind-merge"

export const container = (...classes: ClassNameValue[]) =>
	twMerge("w-full mx-auto max-w-screen-lg px-4", classes)
