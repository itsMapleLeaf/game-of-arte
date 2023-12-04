import { api } from "./_generated/api"
import { internalAction } from "./_generated/server"

export const seed = internalAction({
	async handler(ctx) {
		ctx.runMutation(api.test.seedCharacters)
	},
})
