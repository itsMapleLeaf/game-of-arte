import { query, type QueryCtx } from "./_generated/server"
import { findUserByTokenIdentifier } from "./users"

export const roles = query({
	handler: async (ctx) => {
		return await getRoles(ctx)
	},
})

async function getRoles(ctx: QueryCtx) {
	const user = await findUserByTokenIdentifier(ctx)
	return {
		isAdmin: user?.discordUserId === process.env.ADMIN_DISCORD_USER_ID,
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

export async function requirePlayer(ctx: QueryCtx) {
	const roles = await getRoles(ctx)
	if (!roles.isPlayer) {
		throw new Error("Unauthorized")
	}
}
