import { sleep } from "./index.ts"

export async function tryUntilNonNil<T>(
	callback: () => T,
	{ timeout = 1000, period = 50 } = {},
): Promise<T> {
	const startTime = Date.now()
	let result
	do {
		result = callback()
		if (result != null) return result
		await sleep(period)
	} while (Date.now() - startTime < timeout)
	return result
}
