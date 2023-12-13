import { startCase } from "lodash-es"
import type { MDXModule } from "mdx/types"
import { createDocumentMap } from "~/features/wiki/documents.tsx"

export const guideDocuments = createDocumentMap({
	...import.meta.glob<MDXModule>("./documents/*.md"),
	...import.meta.glob<MDXModule>("./documents/*.mdx"),
})

export const guideLinks = Object.entries(guideDocuments).map(
	([key, document]) => ({
		label: startCase(key.split(/[^a-z]/i).join(" ")),
		icon: document.icon,
		href: `/guide/${key}`,
	}),
)
