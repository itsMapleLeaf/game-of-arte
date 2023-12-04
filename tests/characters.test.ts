import test, { expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
	await page.goto("/")
	await page.waitForEvent("domcontentloaded")
})

test("navigating characters", async ({ page }) => {
	await page.click("text=Eris")
	await expect(page).toHaveTitle(/Eris/)
	await page.click("text=Lyney")
	await expect(page).toHaveTitle(/Lyney/)
})
