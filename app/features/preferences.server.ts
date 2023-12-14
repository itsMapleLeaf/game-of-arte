import { type TypedResponse, createCookie } from "@remix-run/node"
import type { Id, TableNames } from "convex/_generated/dataModel.js"
import { z } from "zod"

const convexIdSchema = <TableName extends TableNames>() =>
	z.custom<Id<TableName>>((value) => typeof value === "string")

const schema = z
	.object({
		characterId: convexIdSchema<"characters">().optional().catch(undefined),
	})
	.catch({})

const cookie = createCookie("arte:characterId", {
	path: "/",
})

export async function getPreferences(request: Request) {
	const data = schema.parse(await cookie.parse(request.headers.get("Cookie")))
	return {
		data,
		async update<T>(
			updates: Partial<z.output<typeof schema>>,
			response: TypedResponse<T> = new Response(),
		) {
			response.headers.append(
				"Set-Cookie",
				await cookie.serialize({ ...data, ...updates }),
			)
			return response
		},
	}
}
