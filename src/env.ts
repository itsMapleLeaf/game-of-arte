import { raise } from "./helpers/errors"

export const env = {
	VITE_PUBLIC_CONVEX_URL: String(
		import.meta.env.VITE_PUBLIC_CONVEX_URL ??
			raise("missing VITE_PUBLIC_CONVEX_URL"),
	),
	VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: String(
		import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY ??
			raise("missing VITE_PUBLIC_CLERK_PUBLISHABLE_KEY"),
	),
}
