import { internal } from "./_generated/api.js"
import { action } from "./_generated/server.js"

export const identify = action({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) return null

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

		const name =
			identity.name || identity.nickname || identity.preferredUsername

		if (!name) {
			console.warn("User has no name", {
				name: identity.name,
				nickname: identity.nickname,
				preferredUsername: identity.preferredUsername,
				tokenIdentifier: identity.tokenIdentifier,
			})
		}

		await ctx.runMutation(internal.users.update, {
			name: name ?? "unnamed",
			tokenIdentifier: identity.tokenIdentifier,
			discordUserId: discordAccount.provider_user_id,
		})
	},
})
