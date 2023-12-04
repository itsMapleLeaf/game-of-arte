import { internalMutation } from "./_generated/server"
import { createCharacter } from "./characters.ts"

export const run = internalMutation({
	async handler(ctx) {
		for (let i = 0; i < 10; i++) {
			createCharacter(ctx)
		}
	},
})
