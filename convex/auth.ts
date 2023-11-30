import type { WebhookEvent } from "@clerk/remix/api.server"
import { createClerkClient } from "@clerk/remix/api.server"
import { Webhook } from "svix"
import { internal } from "./_generated/api.js"
import { httpAction } from "./_generated/server.js"

export const clerkUserWebhook = httpAction(async (ctx, request) => {
	const webhook = new Webhook(process.env.WEBHOOK_SECRET as string)

	const event = webhook.verify(
		await request.text(),
		Object.fromEntries(request.headers),
	) as WebhookEvent
	if (
		event.type !== "user.created" &&
		event.type !== "user.updated" &&
		event.type !== "session.created"
	) {
		throw new Error("Unexpected event type")
	}

	const clerk = createClerkClient({
		secretKey: process.env.CLERK_SECRET_KEY as string,
	})

	const user = await clerk.users.getUser(
		event.type === "session.created" ? event.data.user_id : event.data.id,
	)

	const discordUserId = user.externalAccounts.find(
		(a) => a.provider === "oauth_discord",
	)?.externalId
	if (!discordUserId) {
		throw new Error("Discord account not found")
	}

	await ctx.scheduler.runAfter(0, internal.users.update, {
		name: user.username || "unnamed",
		discordUserId,

		// dangerous implementation detail, but I don't know how else to get this :D
		tokenIdentifier: `${process.env.CLERK_JWT_ISSUER_DOMAIN}|${user.id}`,
	})

	return new Response("OK", { status: 200 })
})
