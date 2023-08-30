import type { ClassNameValue } from "tailwind-merge"
import { panel } from "./panel.ts"

export function input(...classes: ClassNameValue[]) {
	return panel(
		"h-10 w-full min-w-0 rounded-md border p-3 leading-none",
		...classes,
	)
}

export function textArea(...classes: ClassNameValue[]) {
	return panel(
		"w-full min-w-0 rounded-md border px-3 py-2 leading-6 resize-none",
		...classes,
	)
}
