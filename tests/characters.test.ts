import test, { expect } from "@playwright/test"
import { internal } from "convex/_generated/api.js"
import { ConvexHttpClient } from "convex/browser"
import { raise } from "~/helpers/errors.ts"

test.beforeAll(async () => {
	const convex = new ConvexHttpClient(
		process.env.VITE_PUBLIC_CONVEX_URL ?? raise("Missing CONVEX_URL"),
	)
	// @ts-expect-error: unreleased API
	convex.setAdminAuth(process.env.CONVEX_DEPLOY_KEY)
	// @ts-expect-error: unreleased API
	await convex.function(internal.test.seedCharacters)
})

test.beforeEach(async ({ page }) => {
	await page.goto("/")
	await page.waitForEvent("load")
})

test("navigating characters", async ({ page }) => {
	await page.click("text=Eris")
	await expect(page).toHaveTitle(/Eris/)
	await page.click("text=Lyney")
	await expect(page).toHaveTitle(/Lyney/)
})
