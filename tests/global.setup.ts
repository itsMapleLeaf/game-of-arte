import { execa } from "execa"

export default async function setup() {
	if (!process.env.CI) {
		await execa("pnpm", ["run", "seed"], {
			stdio: "inherit",
		})
	}
}
