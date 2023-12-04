import type { APIRequestContext } from "@playwright/test"
import type { api } from "convex/_generated/api.js"

export function runTestFunction(
	request: APIRequestContext,
	functionName: keyof typeof api.test,
) {
	return request.post(`/test/run?function=${functionName}`)
}
