import { internal } from "./_generated/api"
import { action, query, type QueryCtx } from "./_generated/server"
import { findUserByTokenIdentifier } from "./users"

export const identify = action({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) {
			throw new Error("Unauthorized")
		}

		const response = await fetch(
			`https://api.clerk.com/v1/users/${identity.subject}`,
			{
				headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
			},
		)
		if (!response.ok) {
			console.error(await response.json().catch(() => "Unknown error"))
			throw new Error("Failed to fetch user info")
		}

		const clerkUser = (await response.json()) as {
			external_accounts: Array<{
				provider: string
				provider_user_id: string
			}>
		}

		const discordAccount = clerkUser.external_accounts.find(
			(a) => a.provider === "oauth_discord",
		)
		if (!discordAccount) {
			throw new Error("Discord account not found")
		}

		await ctx.runMutation(internal.users.update, {
			name: identity.name!,
			tokenIdentifier: identity.tokenIdentifier,
			discordUserId: discordAccount.provider_user_id,
		})
	},
})

export const roles = query({
	handler: async (ctx) => {
		return await getRoles(ctx)
	},
})

async function getRoles(ctx: QueryCtx) {
	const user = await findUserByTokenIdentifier(ctx)
	return {
		isAdmin: user?.discordUserId === process.env.ADMIN_DISCORD_USER_ID,
		isPlayer: true, // TODO: implement player list config
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
