import { mutation, query } from "convex/_generated/server"
import { v } from "convex/values"
import randimals from "randimals"
import { compareKey } from "../src/helpers/index.ts"
import { getRoles, requireAdmin, requirePlayerUser } from "./roles.ts"
import { nullish, playerDataValidator } from "./schema.ts"
import { findUserByTokenIdentifier } from "./users.ts"

export const list = query({
	handler: async (ctx) => {
		const roles = await getRoles(ctx)
		let query = ctx.db.query("characters")
		if (!roles.isAdmin) {
			query = query.filter((q) => q.neq(q.field("hidden"), true))
		}
		const characters = await query.collect()
		return characters.toSorted(compareKey("name"))
	},
})

export const get = query({
	args: {
		id: nullish(v.id("characters")),
	},
	handler: async (ctx, args) => {
		if (!args.id) return null

		const [character, roles] = await Promise.all([
			ctx.db.get(args.id),
			getRoles(ctx),
		])

		if (!character) return null
		if (!roles.isAdmin && character.hidden) return null

		const [ownerPlayer, user] = await Promise.all([
			ctx.db
				.query("players")
				.filter((q) => q.eq(q.field("ownedCharacterId"), args.id))
				.first(),
			findUserByTokenIdentifier(ctx),
		])

		return {
			...character,
			isOwner:
				ownerPlayer?.discordUserId === user?.discordUserId || roles.isAdmin,
		}
	},
})

export const getOwned = query({
	handler: async (ctx) => {
		const user = await findUserByTokenIdentifier(ctx)
		if (!user) return null

		const player = await ctx.db
			.query("players")
			.withIndex("by_discord_user_id", (q) =>
				q.eq("discordUserId", user.discordUserId),
			)
			.first()
		if (!player?.ownedCharacterId) return null

		return await ctx.db.get(player.ownedCharacterId)
	},
})

export const create = mutation({
	args: { name: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		const id = await ctx.db.insert("characters", {
			name: args.name ?? randimals(),
			hidden: true,
			data: {},
		})
		return { _id: id }
	},
})

export const update = mutation({
	args: {
		id: v.id("characters"),
		name: v.optional(v.string()),
		hidden: v.optional(v.boolean()),
	},
	handler: async (ctx, { id, ...args }) => {
		await requirePlayerUser(ctx)
		await ctx.db.patch(id, args)
	},
})

export const updateData = mutation({
	args: {
		id: v.id("characters"),
		data: playerDataValidator(),
	},
	handler: async (ctx, args) => {
		await requirePlayerUser(ctx)

		const character = await ctx.db.get(args.id)
		if (!character) {
			throw new Error(`Character not found: ${args.id}`)
		}

		await ctx.db.patch(args.id, {
			data: {
				...character.data,
				...args.data,
			},
		})
	},
})

export const remove = mutation({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})
