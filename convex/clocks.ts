import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requirePlayerUser } from "./roles.ts"

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query("clocks").collect()
	},
})

export const add = mutation({
	handler: async (ctx) => {
		await requirePlayerUser(ctx)
		await ctx.db.insert("clocks", {
			name: "New Clock",
			value: 0,
			maxValue: 6,
		})
	},
})

export const update = mutation({
	args: {
		id: v.id("clocks"),
		name: v.optional(v.string()),
		value: v.optional(v.number()),
		maxValue: v.optional(v.number()),
	},
	handler: async (ctx, { id, ...args }) => {
		await requirePlayerUser(ctx)
		await ctx.db.patch(id, args)
	},
})

export const remove = mutation({
	args: {
		id: v.id("clocks"),
	},
	handler: async (ctx, args) => {
		await requirePlayerUser(ctx)
		await ctx.db.delete(args.id)
	},
})
