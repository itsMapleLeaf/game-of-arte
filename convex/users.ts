import { v } from "convex/values"
import type { Id } from "./_generated/dataModel.js"
import {
	type MutationCtx,
	type QueryCtx,
	internalMutation,
} from "./_generated/server.js"

export const upsert = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		discordUserId: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await upsertUser(ctx, args)
	},
})

export async function upsertUser(
	ctx: MutationCtx,
	args: { tokenIdentifier: string; discordUserId?: string; name: string },
): Promise<Id<"users">> {
	const [user, ...duplicates] = await ctx.db
		.query("users")
		.withIndex("by_token_identifier", (q) =>
			q.eq("tokenIdentifier", args.tokenIdentifier),
		)
		.collect()

	const [userId] = await Promise.all([
		user ?
			ctx.db.patch(user._id, args).then(() => user._id)
		:	ctx.db.insert("users", args),
		...duplicates.map((user) =>
			ctx.db.delete(user._id).catch((error) => {
				console.error(`Failed to delete duplicate user ${user._id}:`, error)
			}),
		),
	])

	return userId
}

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

export async function requireAuthenticatedUser(ctx: QueryCtx) {
	const user = await getAuthenticatedUser(ctx)
	if (!user) {
		throw new Error("Not authenticated")
	}
	return user
}
