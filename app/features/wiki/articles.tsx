import { startCase } from "lodash-es"
import { LucideFile } from "lucide-react"
import type { MDXContent, MDXModule } from "mdx/types"
import { type LazyExoticComponent, type ReactNode, Suspense, lazy } from "react"
import { isValidElementType } from "react-is"
import { expect } from "~/helpers/expect.ts"
import { type ExtendedIterable, it } from "~/helpers/iterable.ts"

export interface Article {
	slug: string
	title: string
	content: LazyExoticComponent<MDXContent>
	icon: () => ReactNode
}

export function createArticlesFromModules(
	modules: Record<string, () => Promise<MDXModule>>,
): ExtendedIterable<Article> {
	return it
		.objectEntries(modules)
		.map(([id, load]) => createArticle(getPathBaseName(id), load))
}

function createArticle(slug: string, load: () => Promise<MDXModule>): Article {
	const LazyIcon = lazy(async () => {
		const mod = await load()
		if (
			(mod.icon != null && !isValidElementType(mod.icon)) ||
			typeof mod.icon === "string"
		) {
			throw new Error(`Invalid icon for document ${slug}`)
		}
		return { default: mod.icon ?? LucideFile }
	})

	function Icon() {
		return (
			<Suspense fallback={<LucideFile />}>
				<LazyIcon />
			</Suspense>
		)
	}

	return {
		slug,
		title: startCase(slug.replace(/[^a-z0-9]+/i, " ")),
		icon: Icon,
		content: lazy(load),
	}
}

function getPathBaseName(path: string) {
	return expect(path.split("/").at(-1)).split(".").slice(0, -1).join(".")
}
