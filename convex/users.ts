import { v } from "convex/values"
import { QueryCtx, internalMutation } from "./_generated/server"

export const update = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	},
	handler: async (ctx, { tokenIdentifier, ...args }) => {
		const user = await findUserByTokenIdentifier(ctx)
		if (user) {
			await ctx.db.patch(user._id, { ...args })
		} else {
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
