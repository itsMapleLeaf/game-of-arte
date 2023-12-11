import { v } from "convex/values"
import { raise } from "~/helpers/errors.ts"
import type { Id } from "./_generated/dataModel"
import { type QueryCtx, mutation, query } from "./_generated/server.js"
import { requireAdminRole } from "./roles.ts"

export type PlayerListResult = {
	_id: Id<"players">
	name: string
	assignedCharacterId?: Id<"characters">
}

export const list = query({
	handler: async (ctx): Promise<PlayerListResult[]> => {
		await requireAdminRole(ctx)

		const players = await ctx.db.query("players").collect()

		const userTokenIdentifiers = players
			.map((player) => player.userTokenIdentifier)
			.filter(Boolean)

		const users = await ctx.db
			.query("users")
			.filter((q) =>
				q.or(
					...userTokenIdentifiers.map((id) =>
						q.eq(q.field("tokenIdentifier"), id),
					),
				),
			)
			.collect()

		const usersById = new Map(users.map((user) => [user.tokenIdentifier, user]))

		return players.map((player) => ({
			_id: player._id,
			name: usersById.get(player.userTokenIdentifier)?.name ?? "Unknown",
			assignedCharacterId: player.assignedCharacterId,
		}))
	},
})

export const getAssignedCharacterId = query({
	handler: async (ctx) => {
		const player = await getAuthenticatedPlayer(ctx)
		return player?.assignedCharacterId
	},
})

export const setAssignedCharacterId = mutation({
	args: {
		id: v.id("players"),
		assignedCharacterId: v.id("characters"),
	},
	handler: async (ctx, { id, ...args }) => {
		await requireAdminRole(ctx)
		await ctx.db.patch(id, args)
	},
})

export const remove = mutation({
	args: {
		id: v.id("players"),
	},
	handler: async (ctx, args) => {
		await requireAdminRole(ctx)
		await ctx.db.delete(args.id)
	},
})

export async function getAuthenticatedPlayer(ctx: QueryCtx) {
	const user = await ctx.auth.getUserIdentity()
	if (!user) return

	return await ctx.db
		.query("players")
		.withIndex("by_user_token_identifier", (q) =>
			q.eq("userTokenIdentifier", user.tokenIdentifier),
		)
		.first()
}

export async function requireAuthenticatedPlayer(ctx: QueryCtx) {
	return (
		(await getAuthenticatedPlayer(ctx)) ??
		raise("You must be a player to perform this action")
	)
}
