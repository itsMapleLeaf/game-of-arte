import { twStyle } from "./twStyle.ts"

export const solidButton = twStyle(
	"inline-flex min-h-10 items-center justify-center gap-3 rounded-md border border-accent-700 bg-accent-700 bg-opacity-25 px-3 py-1 leading-tight text-white ring-accent-300 transition hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 [&>svg]:-mx-1 [&>svg]:flex-shrink-0 [&>svg]:s-5",
)
