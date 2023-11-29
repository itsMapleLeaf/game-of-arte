import { v } from "convex/values"
import { type QueryCtx, internalMutation } from "./_generated/server.js"

export const update = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	},
	handler: async (ctx, { tokenIdentifier, ...args }) => {
		const user = await findUserByTokenIdentifier(ctx)
		if (user) {
			console.log("updating user", user._id, args)
			await ctx.db.patch(user._id, { ...args })
		} else {
			console.log("creating user", args)
			await ctx.db.insert("users", { tokenIdentifier, ...args })
		}
	},
})

export async function findUserByTokenIdentifier(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity()
	if (!identity) return

	return await ctx.db
		.query("users")
		.withIndex("by_token_identifier", (q) =>
			q.eq("tokenIdentifier", identity.tokenIdentifier),
		)
		.first()
}
