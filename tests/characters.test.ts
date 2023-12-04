import test, { expect } from "@playwright/test"
import { runTestFunction } from "~/routes/test.run/test.ts"

test.beforeAll(async ({ request }) => {
	await runTestFunction(request, "seedCharacters")
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
