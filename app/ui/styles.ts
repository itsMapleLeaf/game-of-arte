import { type ClassNameValue, twMerge } from "tailwind-merge"
import { twStyle } from "./twStyle.ts"

export const panel = (...classes: ClassNameValue[]) =>
	twMerge(
		"divide-base-800 border-base-800 bg-base-900 shadow-black/50",
		...classes,
	)

export const center = twStyle("flex items-center justify-center")

export const input = twStyle(
	panel("h-10 w-full min-w-0 rounded-md border p-3 leading-none transition"),
)

export const textArea = twStyle(
	panel(
		"block w-full  min-w-0 resize-none rounded-md border px-3 py-2 leading-6 transition",
	),
)

export const checkbox = twStyle("accent-accent-400 s-4")

export const container = (...classes: ClassNameValue[]) =>
	twMerge("mx-auto w-full max-w-screen-lg px-4", classes)
