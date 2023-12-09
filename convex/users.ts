import { v } from "convex/values"
import { type QueryCtx, internalMutation } from "./_generated/server.js"

export const upsert = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const [user, ...duplicates] = await ctx.db
			.query("users")
			.withIndex("by_token_identifier", (q) =>
				q.eq("tokenIdentifier", args.tokenIdentifier),
			)
			.collect()

		await Promise.all(
			duplicates.map((user) =>
				ctx.db.delete(user._id).catch((error) => {
					console.error(`Failed to delete duplicate user ${user._id}:`, error)
				}),
			),
		)

		if (user) {
			await ctx.db.replace(user._id, args)
		} else {
			await ctx.db.insert("users", args)
		}
	},
})

export async function getAuthenticatedUser(ctx: QueryCtx) {
	const identity = await ctx.auth.getUserIdentity()
	if (!identity) return

	return await ctx.db
		.query("users")
		.withIndex("by_token_identifier", (q) =>
			q.eq("tokenIdentifier", identity.tokenIdentifier),
		)
		.first()
}
