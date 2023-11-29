import { type ClassNameValue, twMerge } from "tailwind-merge"

export const container = (...classes: ClassNameValue[]) =>
	twMerge("mx-auto w-full max-w-screen-lg px-4", classes)
