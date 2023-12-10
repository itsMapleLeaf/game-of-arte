import test, { expect } from "@playwright/test"
import { runTestFunction } from "~/routes/test.run/test.ts"
import { signIn } from "./auth.ts"

test.beforeAll(async ({ request }) => {
	await runTestFunction(request, "seedWorld")
})

test("managing invites", async ({ page }) => {
	await page.goto("/", { waitUntil: "networkidle" })

	await signIn(page)
	await runTestFunction(page.request, "seedWorld")
	await runTestFunction(page.request, "removeInvites")
	await runTestFunction(page.request, "removePlayers")

	await page.getByRole("button", { name: "Players" }).click()

	await page
		.getByRole("button", { name: "Add Player" })
		.click({ clickCount: 2 })

	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Invite someone to fill this slot\.$/ }),
	).toHaveCount(2)

	await page
		.getByTestId("inviteListItem")
		.getByRole("button", { name: "Remove" })
		.first()
		.click()

	await expect(
		page
			.locator("div")
			.filter({ hasText: /^Invite someone to fill this slot\.$/ }),
	).toHaveCount(1)
})

test("accepting an invite", async ({ page }) => {
	await runTestFunction(page.request, "seedCharacters")
	await runTestFunction(page.request, "seedTestUser")
	const inviteId = await runTestFunction(page.request, "seedInvite")

	await page.goto(`/join?invite=${inviteId}`, { waitUntil: "networkidle" })

	await signIn(page)

	await page.getByRole("button", { name: /let me in/i }).click()
	await page.getByLabel("Name").click()
	await page.getByLabel("Name").fill("Eris!!!")
	await expect(page.getByRole("link", { name: "Eris!!!" })).toBeVisible()
})

test("invalid invite", async ({ page }) => {
	await page.goto("/join?invite=invalid", { waitUntil: "networkidle" })
	await signIn(page)
	await expect(page.getByTestId("invalidInviteMessage")).toBeVisible()
	await page.getByRole("link", { name: /go home/i }).click()
	await expect(page).not.toHaveURL(/^\/join/)
})
