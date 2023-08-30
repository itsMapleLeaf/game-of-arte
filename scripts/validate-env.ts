import chalk from "chalk"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseNonNil } from "../src/helpers/errors.ts"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")

const envExampleContent = await readFile(
	path.resolve(projectRoot, ".env.example"),
	"utf8",
)

const variables = envExampleContent
	.split("\n")
	.filter((line) => line.startsWith("VITE_PUBLIC_"))
	.map((line) => parseNonNil(line.split("=")[0]))

const missing = variables.filter((variable) => !process.env[variable])

if (missing.length) {
	const missingList = missing.map((variable) => ` • ${variable}`).join("\n")
	console.error(
		`${chalk.redBright`❌ Missing environment variables:\n`}${missingList}`,
	)
	process.exit(1)
}

console.info(chalk.greenBright`✅ All environment variables are set.`)
