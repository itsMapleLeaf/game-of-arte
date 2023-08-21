import { twMerge, type ClassNameValue } from "tailwind-merge"
import { panel } from "./panel"

export function input(...classes: ClassNameValue[]) {
	return panel(
		"h-10 w-full min-w-0 rounded-md border p-3 leading-none",
		...classes,
	)
}

export function textArea(...classes: ClassNameValue[]) {
	return panel(
		"max-h-64 w-full min-w-0 rounded-md border px-3 py-2 leading-6",
		...classes,
	)
}

export function field(...classes: ClassNameValue[]) {
	return twMerge("flex flex-col gap-1 w-full min-w-0", ...classes)
}

export function fieldDescription(...classes: ClassNameValue[]) {
	return twMerge("text-sm opacity-75", ...classes)
}

export function labelText(...classes: ClassNameValue[]) {
	return twMerge("font-medium leading-none", ...classes)
}
