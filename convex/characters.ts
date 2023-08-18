import { mutation, query } from "convex/_generated/server"
import { v } from "convex/values"
import { requireAdmin, requirePlayer } from "./auth"

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("characters").collect()
	},
})

export const get = query({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		const character = await ctx.db.get(args.id)
		return { character }
	},
})

export const protectedCreate = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.insert("characters", {
			name: args.name,
			sheetValues: [],
		})
	},
})

export const update = mutation({
	args: { id: v.id("characters"), name: v.string() },
	handler: async (ctx, args) => {
		await requirePlayer(ctx)
		await ctx.db.patch(args.id, { name: args.name })
	},
})

export const setSheetValue = mutation({
	args: {
		id: v.id("characters"),
		key: v.string(),
		value: v.union(v.string(), v.number()),
	},
	handler: async (ctx, args) => {
		await requirePlayer(ctx)

		const character = await ctx.db.get(args.id)
		if (!character) {
			throw new Error(`Character not found: ${args.id}`)
		}

		const sheetValues = character.sheetValues.map((sv) => {
			return sv.key === args.key ? { key: args.key, value: args.value } : sv
		})

		await ctx.db.patch(args.id, { sheetValues })
	},
})

export const remove = mutation({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await ctx.db.delete(args.id)
	},
})
