import { httpRouter } from "convex/server"
import { clerkUserWebhook } from "./clerk.ts"

const http = httpRouter()

http.route({
	path: "/webhooks/clerk/user",
	method: "POST",
	handler: clerkUserWebhook,
})

export default http
