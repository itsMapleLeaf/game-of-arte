import { panel } from "./panel.ts"
import { twStyle } from "./twStyle.ts"

export const center = twStyle("flex items-center justify-center")

export const input = twStyle(
	panel("h-10 w-full min-w-0 rounded-md border p-3 leading-none transition"),
)

export const textArea = twStyle(
	panel(
		"w-full min-w-0 resize-none rounded-md border px-3 py-2 leading-6 transition",
	),
)

export const checkbox = twStyle("accent-accent-400 s-4")
