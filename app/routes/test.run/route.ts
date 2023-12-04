import { type ActionFunctionArgs, json } from "@remix-run/node"
import { api } from "convex/_generated/api.js"
import { ConvexHttpClient } from "convex/browser"
import { env } from "~/env.ts"
import { expect } from "~/helpers/expect.ts"

export async function action({ request }: ActionFunctionArgs) {
	const functionName = expect(new URL(request.url).searchParams.get("function"))
	const convex = new ConvexHttpClient(env.VITE_PUBLIC_CONVEX_URL)
	return json(
		await convex.mutation(api.test[functionName as keyof typeof api.test]),
	)
}
