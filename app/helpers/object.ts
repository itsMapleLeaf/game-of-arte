export function pick<T extends object, K extends keyof T>(
	obj: T,
	keys: K[],
): Pick<T, K> {
	const result = {} as Pick<T, K>
	for (const key of keys) {
		result[key] = obj[key]
	}
	return result
}

export function isObject(value: unknown): value is object {
	return typeof value === "object" && value !== null
}
