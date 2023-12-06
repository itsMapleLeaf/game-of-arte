import type { BrowserClerk } from "@clerk/remix"
import type { Page } from "@playwright/test"

declare global {
	interface Window {
		Clerk: BrowserClerk
	}
}

export async function signIn(page: Page) {
	await page.waitForFunction(() => window.Clerk?.isReady())
	await page.evaluate(async () => {
		if (!window.Clerk.client) {
			throw new Error("Clerk client not found")
		}
		const response = await window.Clerk.client.signIn.create({
			strategy: "password",
			identifier: "example@clerk.dev",
			password: "clerkpassword1234",
		})
		await window.Clerk.setActive({
			session: response.createdSessionId,
		})
		return true
	})
}
