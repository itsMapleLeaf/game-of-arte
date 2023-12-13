import { type MetaFunction, useParams } from "@remix-run/react"
import { Suspense } from "react"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { guideDocuments } from "~/features/guide/data.ts"
import { expect } from "~/helpers/expect.ts"

export const meta: MetaFunction = ({ params }) => [
	{
		title: [guideDocuments[expect(params.document)]?.title, "Game of Arte"]
			.filter(Boolean)
			.join(" | "),
	},
]

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
