import { httpRouter } from "convex/server"
import { clerkUserWebhook } from "./auth.ts"

const http = httpRouter()

http.route({
	path: "/webhooks/clerk/user",
	method: "POST",
	handler: clerkUserWebhook,
})

export default http
