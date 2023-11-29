import { v } from "convex/values"
import type { Simplify } from "../app/helpers/types.ts"
import type { Doc } from "./_generated/dataModel"
import { type MutationCtx, mutation, query } from "./_generated/server.js"
import { requireAdmin, requirePlayerUser } from "./roles.ts"

export type World = Simplify<Omit<Doc<"worlds">, "_id" | "_creationTime">>

export const get = query({
	handler: async (ctx): Promise<World> => {
		const world = await ctx.db.query("worlds").first()
		return world ?? { experience: 0 }
	},
})

export const update = mutation({
	args: {
		experience: v.optional(v.number()),
		mana: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx)
		await updateWorld(ctx, args)
	},
})

export const subtractMana = mutation({
	args: {
		amount: v.number(),
	},
	handler: async (ctx, args) => {
		await requirePlayerUser(ctx)
		const world = await ctx.db.query("worlds").first()
		await updateWorld(ctx, {
			mana: Math.max(0, (world?.mana ?? 0) - args.amount),
		})
	},
})

async function updateWorld(
	ctx: MutationCtx,
	data: { experience?: number | undefined; mana?: number | undefined },
) {
	const world = await ctx.db.query("worlds").first()
	if (world) {
		await ctx.db.patch(world._id, data)
	} else {
		await ctx.db.insert("worlds", {
			experience: 0,
			...data,
		})
	}
}
