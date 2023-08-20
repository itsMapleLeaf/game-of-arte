import { mutation, query } from "convex/_generated/server"
import { v } from "convex/values"
import randimals from "randimals"
import { requireAdmin, requirePlayer } from "./roles"
import { playerDataValidator } from "./schema.ts"

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("characters").collect()
	},
})

export const get = query({
	args: { id: v.id("characters") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id)
	},
})

export const create = mutation({
	args: { name: v.optional(v.string()) },
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		const id = await ctx.db.insert("characters", {
			name: args.name ?? randimals(),
			data: {},
		})
		return { _id: id }
	},
})

export const update = mutation({
	args: { id: v.id("characters"), name: v.string() },
	handler: async (ctx, args) => {
		await requirePlayer(ctx)
		await ctx.db.patch(args.id, { name: args.name })
	},
})

export const updateData = mutation({
	args: {
		id: v.id("characters"),
		data: playerDataValidator(),
	},
	handler: async (ctx, args) => {
		await requirePlayer(ctx)

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
