import { type QueryCtx, mutation, query } from "convex/_generated/server"
import { v } from "convex/values"
import randimals from "randimals"
import { compareKey } from "~/helpers/collections.ts"
import type { Id } from "./_generated/dataModel"
import {
	conditionValidator,
	sorceryDeviceValidator,
} from "./characters.validators.ts"
import { getRoles, requireAdmin, requirePlayerUser } from "./roles.ts"
import { getAuthenticatedUser } from "./users.ts"
import { nullish, record } from "./validators.ts"

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
			getAuthenticatedUser(ctx),
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
		const user = await getAuthenticatedUser(ctx)
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
		conditions: v.optional(v.array(conditionValidator)),
	},
	handler: async (ctx, { id, ...args }) => {
		await requirePlayerUser(ctx)
		await ctx.db.patch(id, args)
	},
})

export const updateData = mutation({
	args: {
		id: v.id("characters"),
		data: record<string | number>(),
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

export const setSorceryDevice = mutation({
	args: {
		id: v.id("characters"),
		sorceryDevice: v.union(sorceryDeviceValidator, v.null()),
	},
	handler: async (ctx, args) => {
		await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(args.id, {
			sorceryDevice: args.sorceryDevice ?? undefined,
		})
	},
})

export const addCondition = mutation({
	args: {
		id: v.id("characters"),
		condition: conditionValidator,
	},
	handler: async (ctx, args) => {
		const character = await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(character._id, {
			conditions: [...(character?.conditions ?? []), args.condition],
		})
	},
})

export const removeCondition = mutation({
	args: {
		id: v.id("characters"),
		conditionId: v.string(),
	},
	handler: async (ctx, args) => {
		const character = await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(character._id, {
			conditions: character.conditions?.filter(
				(c) => c.id !== args.conditionId,
			),
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

async function requireOwnedCharacter(
	ctx: QueryCtx,
	characterId: Id<"characters">,
) {
	const character = await ctx.db.get(characterId)
	if (!character) {
		throw new Error(`Character not found: ${characterId}`)
	}

	const user = await requirePlayerUser(ctx)
	if (user.discordUserId === process.env.ADMIN_DISCORD_USER_ID) {
		return character
	}

	const player = await ctx.db
		.query("players")
		.withIndex("by_discord_user_id", (q) =>
			q.eq("discordUserId", user.discordUserId),
		)
		.first()

	if (!player) {
		throw new Error(`User ${user.name} is not a player`)
	}

	if (player.ownedCharacterId !== character._id) {
		throw new Error(
			`User ${user.name} does not own character ${character.name}`,
		)
	}

	return character
}
