import { execa } from "execa"

export default async function setup() {
	await execa("pnpm", ["run", "seed"])
}
