import { type MetaFunction, useParams } from "@remix-run/react"
import { Suspense } from "react"
import { guideDocuments } from "~/features/guide/data.ts"
import { expect } from "~/helpers/expect.ts"
import { getMeta } from "~/meta.ts"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder.tsx"

export const meta: MetaFunction = ({ params }) => {
	const document = guideDocuments[expect(params.document)]
	return getMeta({ title: document?.title })
}

export default function RulesDocumentPage() {
	const params = useParams()
	const documentName = expect(params.document)
	const document = guideDocuments[documentName]
	return document ?
			<main>
				<h1>{document.title}</h1>
				<Suspense fallback={<LoadingPlaceholder />}>
					<document.content />
				</Suspense>
			</main>
		:	<main>
				<h1>404</h1>
				<p>Document not found</p>
			</main>
}
