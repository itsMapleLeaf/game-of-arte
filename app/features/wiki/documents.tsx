import { startCase } from "lodash-es"
import { LucideFile } from "lucide-react"
import type { MDXModule } from "mdx/types"
import { Suspense, lazy } from "react"
import { isValidElementType } from "react-is"
import { expect } from "~/helpers/expect.ts"

export function createDocumentMap(
	modules: Record<string, () => Promise<MDXModule>>,
) {
	return Object.fromEntries(
		Object.entries(modules).map(([key, load]) => [
			key.replace("./documents/", "").replace(/\.mdx?$/, ""),
			createDocument(key, load),
		]),
	)
}

function createDocument(key: string, load: () => Promise<MDXModule>) {
	const LazyIcon = lazy(async () => {
		const mod = await load()
		if (
			(mod.icon != null && !isValidElementType(mod.icon)) ||
			typeof mod.icon === "string"
		) {
			throw new Error(`Invalid icon for document ${key}`)
		}
		return { default: mod.icon ?? LucideFile }
	})

	function DocumentIcon() {
		return (
			<Suspense fallback={<LucideFile />}>
				<LazyIcon />
			</Suspense>
		)
	}

	const fileName = expect(key.match(/([^\/]+)\.(?:mdx?)$/)?.[1])
	return {
		title: startCase(fileName.replace(/[^a-z0-9]+/i, " ")),
		icon: DocumentIcon,
		content: lazy(load),
	}
}
