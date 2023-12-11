import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdminRole } from "./roles.ts"

export const create = mutation({
	async handler(ctx) {
		await requireAdminRole(ctx)
		return await ctx.db.insert("invites", {})
	},
})

export const list = query({
	async handler(ctx) {
		await requireAdminRole(ctx)
		return await ctx.db.query("invites").collect()
	},
})

export const get = query({
	args: {
		id: v.string(),
	},
	async handler(ctx, args) {
		const inviteId = ctx.db.normalizeId("invites", args.id)
		return inviteId ? await ctx.db.get(inviteId) : null
	},
})

export const accept = mutation({
	args: {
		id: v.id("invites"),
	},
	async handler(ctx, { id }) {
		const [identity, invite] = await Promise.all([
			ctx.auth.getUserIdentity(),
			ctx.db.get(id),
		])

		if (!identity) {
			throw new Error("Not authenticated")
		}

		if (!invite) {
			throw new Error("Invite not found")
		}

		const [player] = await Promise.all([
			ctx.db.insert("players", {
				userTokenIdentifier: identity.tokenIdentifier,
			}),
			ctx.db.delete(invite._id),
		])

		return player
	},
})

export const remove = mutation({
	args: {
		id: v.id("invites"),
	},
	async handler(ctx, { id }) {
		await requireAdminRole(ctx)
		await ctx.db.delete(id)
	},
})
