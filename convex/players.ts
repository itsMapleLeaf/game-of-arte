import { v } from "convex/values"
import { raise } from "~/helpers/errors.ts"
import type { Doc } from "./_generated/dataModel"
import { type QueryCtx, mutation, query } from "./_generated/server.js"
import { requireAdmin } from "./roles.ts"
import { getAuthenticatedUser } from "./users.ts"

export const self = query({
	handler: async (ctx) => {
		const user = await getAuthenticatedUser(ctx)
		if (!user) return null

		return await ctx.db
			.query("players")
			.withIndex("by_discord_user_id", (q) =>
				q.eq("discordUserId", user.discordUserId),
			)
			.first()
	},
})

export const list = query({
	handler: async (ctx) => {
		await requireAdmin(ctx)

		const players = await ctx.db.query("players").collect()
		const discordUserIds = players.map((player) => player.discordUserId)

		const users = await ctx.db
			.query("users")
			.filter((q) =>
				q.or(...discordUserIds.map((id) => q.eq(q.field("discordUserId"), id))),
			)
			.collect()

		const usersByDiscordUserId = new Map(
			users.map((user) => [user.discordUserId, user]),
		)

		return players.map((player) => ({
			...player,
			name: usersByDiscordUserId.get(player.discordUserId)?.name,
		}))
	},
})

export const add = mutation({
	args: {
		discordUserId: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)

		const existing = await ctx.db
			.query("players")
			.withIndex("by_discord_user_id", (q) =>
				q.eq("discordUserId", args.discordUserId),
			)
			.first()

		if (existing) {
			throw new Error("Player already exists")
		}

		await ctx.db.insert("players", {
			discordUserId: args.discordUserId,
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("players"),
		ownedCharacterId: v.optional(v.id("characters")),
	},
	handler: async (ctx, { id, ...args }) => {
		await requireAdmin(ctx)
		await ctx.db.patch(id, args)
	},
})

export const remove = mutation({
	args: {
		id: v.id("players"),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})

export async function getPlayer(ctx: QueryCtx) {
	const user = await getAuthenticatedUser(ctx)
	return user && (await getPlayerByUser(ctx, user))
}

export async function getPlayerByUser(
	ctx: QueryCtx,
	user: { discordUserId: string },
) {
	return await ctx.db
		.query("players")
		.withIndex("by_discord_user_id", (q) =>
			q.eq("discordUserId", user.discordUserId),
		)
		.first()
}

export async function requirePlayerByUser(ctx: QueryCtx, user: Doc<"users">) {
	return (
		(await getPlayerByUser(ctx, user)) ??
		raise(`User ${user.name} is not a player`)
	)
}
