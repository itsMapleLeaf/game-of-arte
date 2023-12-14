import { getAuth } from "@clerk/remix/ssr.server"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { ConvexHttpClient } from "convex/browser"
import { env } from "~/env.ts"

export async function createConvexClient(args: LoaderFunctionArgs) {
	const convex = new ConvexHttpClient(env.VITE_PUBLIC_CONVEX_URL)

	const { getToken } = await getAuth(args)
	const token = await getToken({ template: "convex" })
	if (token) {
		convex.setAuth(token)
	}

	return convex
}
