import { test } from "@playwright/test"
import { runTestFunction } from "~/routes/test.run/test.ts"
import { signIn } from "./auth.ts"

test.beforeEach(async ({ page }) => {
	await runTestFunction(page.request, "seedCharacters")
	await runTestFunction(page.request, "removeDiceRolls")
	await page.goto("/", { waitUntil: "networkidle" })
})

test("rolling dice", async ({ page }) => {
	await signIn(page)

	await page.getByRole("button", { name: "Roll Agility" }).click()
	await page.getByRole("button", { name: "Roll 7 Dice" }).click()
})
