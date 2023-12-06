import type { Nullish } from "~/helpers/types.ts"
import type { Doc } from "./_generated/dataModel"
import { type QueryCtx, query } from "./_generated/server.js"
import { getPlayerByUser } from "./players.ts"
import { getAuthenticatedUser } from "./users.ts"

export const get = query({
	handler: async (ctx) => {
		return await getRoles(ctx)
	},
})

export type Roles = {
	isAdmin: boolean
	isPlayer: boolean
	isSpectator: boolean
}

export async function getRoles(ctx: QueryCtx): Promise<Roles> {
	return await getRolesByUser(ctx, await getAuthenticatedUser(ctx))
}

export async function getRolesByUser(
	ctx: QueryCtx,
	user: Nullish<Doc<"users">>,
): Promise<Roles> {
	if (process.env.TEST === "true") {
		return { isAdmin: true, isPlayer: true, isSpectator: false }
	}

	if (!user) {
		return { isAdmin: false, isPlayer: false, isSpectator: true }
	}

	if (user.discordUserId === process.env.ADMIN_DISCORD_USER_ID) {
		return { isAdmin: true, isPlayer: true, isSpectator: false }
	}

	const player = await ctx.db
		.query("players")
		.withIndex("by_discord_user_id", (q) =>
			q.eq("discordUserId", user.discordUserId),
		)
		.first()

	if (!player) {
		return { isAdmin: false, isPlayer: false, isSpectator: true }
	}

	return { isAdmin: false, isPlayer: false, isSpectator: true }
}

export async function requireAdmin(ctx: QueryCtx) {
	const roles = await getRoles(ctx)
	if (!roles.isAdmin) {
		throw new Error("Unauthorized")
	}
}

export async function getPlayerUser(ctx: QueryCtx) {
	const user = await getAuthenticatedUser(ctx)
	if (!user) return

	if (user.discordUserId === process.env.ADMIN_DISCORD_USER_ID) {
		return user
	}

	const player = await getPlayerByUser(ctx, user)
	if (!player) return

	return user
}

export async function requirePlayerUser(ctx: QueryCtx) {
	const user = await getPlayerUser(ctx)
	if (!user) {
		throw new Error("Unauthorized")
	}
	return user
}
