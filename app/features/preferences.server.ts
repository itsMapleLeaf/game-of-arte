import { createCookie } from "@remix-run/node"
import { z } from "zod"

const schema = z
	.object({
		characterId: z.string().optional().catch(undefined),
	})
	.catch({})

const cookie = createCookie("arte:characterId", {
	path: "/",
})

export async function getPreferences(request: Request) {
	const data = schema.parse(await cookie.parse(request.headers.get("Cookie")))
	return {
		data,
		async update(
			updates: Partial<z.output<typeof schema>>,
			response = new Response(),
		) {
			response.headers.append(
				"Set-Cookie",
				await cookie.serialize({ ...data, ...updates }),
			)
			return response
		},
	}
}
