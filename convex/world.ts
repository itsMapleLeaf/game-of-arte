import { v } from "convex/values"
import type { Simplify } from "../src/helpers/types.ts"
import type { Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server.js"
import { requireAdmin } from "./roles.ts"

export type World = Simplify<Omit<Doc<"worlds">, "_id" | "_creationTime">>

export const get = query({
	handler: async (ctx): Promise<World> => {
		const world = await ctx.db.query("worlds").first()
		return world ?? { experience: 0 }
	},
})

export const update = mutation({
	args: {
		experience: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		const world = await ctx.db.query("worlds").first()
		if (world) {
			await ctx.db.patch(world._id, args)
		} else {
			await ctx.db.insert("worlds", args)
		}
	},
})
