import { raise } from "./helpers/errors.ts"

function validateEnvValue(value: string | undefined): string {
	return value || raise("Environment variable not set", validateEnvValue)
}

export const env = {
	CONVEX_URL: validateEnvValue(import.meta.env.VITE_PUBLIC_CONVEX_URL),
	CLERK_PUBLISHABLE_KEY: validateEnvValue(
		import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY,
	),
}
