import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "convex/_generated/server"
import { v } from "convex/values"
import randimals from "randimals"
import { compareKey, upsertArray } from "~/helpers/collections.ts"
import { raise } from "~/helpers/errors.ts"
import type { Id } from "./_generated/dataModel"
import {
	conditionValidator,
	sorceryDeviceValidator,
	sorcerySpellValidator,
} from "./characters.validators.ts"
import { getAuthenticatedPlayer } from "./players.ts"
import { hasAdminRole, requireAdminRole, requirePlayerRole } from "./roles.ts"
import { nullish, record } from "./validators.ts"

export const list = query({
	handler: async (ctx) => {
		const isAdmin = await hasAdminRole(ctx)
		let query = ctx.db.query("characters")
		if (!isAdmin) {
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

		const [character, isAdmin] = await Promise.all([
			ctx.db.get(args.id),
			hasAdminRole(ctx),
		])

		if (!character) return null
		if (character.hidden && !isAdmin) return null

		return character
	},
})

export const getOwned = query({
	handler: async (ctx) => {
		const player = await getAuthenticatedPlayer(ctx)
		if (!player?.assignedCharacterId) return null
		return await ctx.db.get(player.assignedCharacterId)
	},
})

export const getDefault = query({
	handler: async (ctx) => {
		const player = await getAuthenticatedPlayer(ctx)
		if (player?.assignedCharacterId) {
			const character = await ctx.db.get(player.assignedCharacterId)
			if (character) return character
		}

		const firstVisible = await ctx.db
			.query("characters")
			.filter((q) => q.neq(q.field("hidden"), true))
			.first()
		if (firstVisible) return firstVisible

		return await ctx.db.query("characters").first()
	},
})

export const create = mutation({
	args: { name: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdminRole(ctx)
		const id = await createCharacter(ctx, { name: args.name })
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
		await requirePlayerRole(ctx)
		await ctx.db.patch(id, args)
	},
})

export const updateData = mutation({
	args: {
		id: v.id("characters"),
		data: record<string | number>(),
	},
	handler: async (ctx, args) => {
		await requirePlayerRole(ctx)

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

export const upsertFreeformSpell = mutation({
	args: {
		id: v.id("characters"),
		spell: sorcerySpellValidator,
	},
	handler: async (ctx, args) => {
		const character = await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(args.id, {
			freeformSpells: upsertArray(
				character?.freeformSpells ?? [],
				args.spell,
				"id",
			),
		})
	},
})

export const removeFreeformSpell = mutation({
	args: {
		id: v.id("characters"),
		spellId: v.string(),
	},
	handler: async (ctx, args) => {
		const character = await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(character._id, {
			freeformSpells: character.freeformSpells?.filter(
				(s) => s.id !== args.spellId,
			),
		})
	},
})

export const upsertCondition = mutation({
	args: {
		id: v.id("characters"),
		condition: conditionValidator,
	},
	handler: async (ctx, args) => {
		const character = await requireOwnedCharacter(ctx, args.id)
		await ctx.db.patch(character._id, {
			conditions: upsertArray(
				character?.conditions ?? [],
				args.condition,
				"id",
			),
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
		await requireAdminRole(ctx)
		await ctx.db.delete(args.id)
	},
})

export function createCharacter(
	ctx: MutationCtx,
	{
		name = randimals(),
		hidden = true,
		data = {},
	}: {
		name?: string
		hidden?: boolean
		data?: Record<string, string | number>
	} = {},
) {
	return ctx.db.insert("characters", {
		name,
		hidden,
		data,
	})
}

async function requireCharacter(ctx: QueryCtx, characterId: Id<"characters">) {
	return (await ctx.db.get(characterId)) ?? raise("Character not found")
}

async function requireOwnedCharacter(
	ctx: QueryCtx,
	characterId: Id<"characters">,
) {
	const [character, player, isAdmin, identity] = await Promise.all([
		requireCharacter(ctx, characterId),
		getAuthenticatedPlayer(ctx),
		hasAdminRole(ctx),
		ctx.auth.getUserIdentity(),
	])

	if (isAdmin || player?.assignedCharacterId === character._id) {
		return character
	}

	const id = identity?.tokenIdentifier ?? "anonymous"
	const name = identity?.name ?? "(anonymous user)"
	throw new Error(
		`User ${name} (${id}) does not own character ${character.name}`,
	)
}
