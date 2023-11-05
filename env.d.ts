import "@total-typescript/ts-reset"
import "vite/client"

declare global {
	interface ImportMetaEnv {
		VITE_PUBLIC_CONVEX_URL: string
		VITE_PUBLIC_CLERK_PUBLISHABLE_KEY: string
	}
}
