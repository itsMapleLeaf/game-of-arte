import "@total-typescript/ts-reset"
import "vite/client"

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface ErrorConstructor {
		// eslint-disable-next-line @typescript-eslint/ban-types
		captureStackTrace(thisArg: Error, func?: Function): void
	}
}
