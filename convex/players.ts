import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./roles.ts"

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

export const remove = mutation({
	args: {
		id: v.id("players"),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})
