import { query, type QueryCtx } from "./_generated/server"
import { findUserByTokenIdentifier } from "./users"

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

async function getRoles(ctx: QueryCtx): Promise<Roles> {
	const user = await findUserByTokenIdentifier(ctx)
	if (!user) {
		return { isAdmin: false, isPlayer: false, isSpectator: true }
	}

	const isAdmin = user.discordUserId === process.env.ADMIN_DISCORD_USER_ID
	if (isAdmin) {
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

	return {
		isAdmin: false,
		isPlayer: true,
		isSpectator: false,
	}
}

export async function requireAdmin(ctx: QueryCtx) {
	const roles = await getRoles(ctx)
	if (!roles.isAdmin) {
		throw new Error("Unauthorized")
	}
}

export async function getPlayerUser(ctx: QueryCtx) {
	const user = await findUserByTokenIdentifier(ctx)
	if (!user) return

	if (user.discordUserId === process.env.ADMIN_DISCORD_USER_ID) {
		return user
	}

	const player = await ctx.db
		.query("players")
		.withIndex("by_discord_user_id", (q) =>
			q.eq("discordUserId", user.discordUserId),
		)
		.first()

	if (!player) {
		return
	}

	return user
}

export async function requirePlayerUser(ctx: QueryCtx) {
	const user = await getPlayerUser(ctx)
	if (!user) {
		throw new Error("Unauthorized")
	}
	return user
}
