import { test as setup } from "@playwright/test"
import { execa } from "execa"

setup("seed database", async () => {
	await execa("pnpm", ["run", "seed"])
})
