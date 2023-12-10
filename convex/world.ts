import { v } from "convex/values"
import type { Simplify } from "../app/helpers/types.ts"
import type { Doc } from "./_generated/dataModel"
import {
	type MutationCtx,
	type QueryCtx,
	mutation,
	query,
} from "./_generated/server.js"
import { requireAdminRole, requirePlayerRole } from "./roles.ts"

export type World = Simplify<Omit<Doc<"worlds">, "_id" | "_creationTime">>

export const get = query({
	handler: async (ctx): Promise<World> => {
		return await getWorld(ctx)
	},
})

export const update = mutation({
	args: {
		experience: v.optional(v.number()),
		mana: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdminRole(ctx)
		await updateWorld(ctx, args)
	},
})

export const subtractMana = mutation({
	args: {
		amount: v.number(),
	},
	handler: async (ctx, args) => {
		const [world] = await Promise.all([getWorld(ctx), requirePlayerRole(ctx)])
		await updateWorld(ctx, {
			mana: Math.max(0, (world?.mana ?? 0) - args.amount),
		})
	},
})

export async function getWorld(ctx: QueryCtx) {
	const world = await ctx.db.query("worlds").first()
	return world ?? { experience: 0, mana: 12 }
}

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
