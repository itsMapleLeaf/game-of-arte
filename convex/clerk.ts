import type { WebhookEvent } from "@clerk/remix/api.server"
import { createClerkClient } from "@clerk/remix/api.server"
import { Webhook } from "svix"
import { internal } from "./_generated/api.js"
import { httpAction } from "./_generated/server.js"
import { convexEnv } from "./env.ts"

export const clerkUserWebhook = httpAction(async (ctx, request) => {
	const webhook = new Webhook(convexEnv.WEBHOOK_SECRET as string)

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
		secretKey: convexEnv.CLERK_SECRET_KEY as string,
	})

	const user = await clerk.users.getUser(
		event.type === "session.created" ? event.data.user_id : event.data.id,
	)

	await ctx.scheduler.runAfter(0, internal.users.upsert, {
		name: user.username || "unnamed",
		// dangerous implementation detail, but I don't know how else to get this :D
		tokenIdentifier: `${convexEnv.CLERK_JWT_ISSUER_DOMAIN}|${user.id}`,
	})

	return new Response("OK", { status: 200 })
})
