import { range } from "~/helpers/range.ts"
import { internalMutation } from "./_generated/server"
import { createCharacter } from "./characters.ts"

export const run = internalMutation({
	async handler(ctx) {
		await Promise.all(
			range(10).map(() => createCharacter(ctx, { hidden: false })),
		)
	},
})
