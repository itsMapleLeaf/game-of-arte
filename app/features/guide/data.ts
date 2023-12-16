import type { MDXModule } from "mdx/types"
import { createDocumentMap } from "~/features/wiki/documents.tsx"

export const guideDocuments = createDocumentMap({
	...import.meta.glob<MDXModule>("./documents/*.md"),
	...import.meta.glob<MDXModule>("./documents/*.mdx"),
})
