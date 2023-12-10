import type { APIRequestContext } from "@playwright/test"
import type { api } from "convex/_generated/api.js"
import type { FunctionReturnType } from "convex/server"

export async function runTestFunction<Name extends keyof typeof api.test>(
	request: APIRequestContext,
	functionName: Name,
) {
	const response = await request.post(`/test/run?function=${functionName}`)
	return (await response.json()) as FunctionReturnType<(typeof api.test)[Name]>
}
