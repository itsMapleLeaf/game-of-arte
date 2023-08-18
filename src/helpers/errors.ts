export function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function raise(value: unknown, caller?: Function): never {
	if (typeof value === "string") {
		const error = new Error(value)
		Error.captureStackTrace(error, caller)
		throw error
	}

	if (value instanceof Error) {
		Error.captureStackTrace(value, caller)
		throw value
	}

	throw value
}

export function parseNonNil<T>(value: T | undefined | null): T {
	return value ?? raise("Expected non-nil value", parseNonNil)
}