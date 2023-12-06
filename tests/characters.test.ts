import { expect, test } from "@playwright/test"
import { runTestFunction } from "~/routes/test.run/test.ts"
import { signIn } from "./auth"

test.beforeEach(async ({ page }) => {
	await runTestFunction(page.request, "seedCharacters")
	await page.goto("/", { waitUntil: "networkidle" })
})

test("navigating characters", async ({ page }) => {
	await page.click("text=Eris")
	await expect(page).toHaveTitle(/Eris/)
	await page.click("text=Lyney")
	await expect(page).toHaveTitle(/Lyney/)
})

test("adding character condition", async ({ page }) => {
	// await signIn(page)

	const conditionDescription = `Test Condition ${Math.random()}`

	const dialog = page.getByRole("dialog")
	const descriptionInput = dialog.getByLabel("Description")
	const physicalStressInput = dialog.getByLabel("Phys. Stress")
	const mentalStressInput = dialog.getByLabel("Ment. Stress")

	const submitButton = dialog.getByText("Submit")

	const emptyError = dialog.getByRole("alert").getByText("Cannot be empty")
	const zeroStressError = dialog
		.getByRole("alert")
		.getByText("Must have at least 1 stress")

	await page.click("text=Eris")

	await page.click("text=Add Condition")
	await submitButton.click()
	await expect(emptyError).toBeVisible()
	await expect(zeroStressError).toBeVisible()

	await descriptionInput.fill(conditionDescription)
	await submitButton.click()
	await expect(emptyError).not.toBeVisible()
	await expect(zeroStressError).toBeVisible()

	await descriptionInput.clear()
	await physicalStressInput.getByRole("button", { name: "Increase" }).click()
	await expect(physicalStressInput).toContainText("1")
	await submitButton.click()
	await expect(emptyError).toBeVisible()
	await expect(zeroStressError).not.toBeVisible()

	await physicalStressInput.getByRole("button", { name: "Decrease" }).click()
	await expect(physicalStressInput).toContainText("0")
	await mentalStressInput.getByRole("button", { name: "Increase" }).click()
	await expect(mentalStressInput).toContainText("1")
	await submitButton.click()
	await expect(emptyError).toBeVisible()
	await expect(zeroStressError).not.toBeVisible()

	await descriptionInput.fill(conditionDescription)
	await submitButton.click()

	await expect(submitButton).not.toBeVisible()
	await expect(page.getByText(conditionDescription)).toBeVisible()
})
