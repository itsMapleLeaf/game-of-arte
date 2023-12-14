import { type MetaFunction, useParams } from "@remix-run/react"
import { Suspense } from "react"
import { getGuideArticle } from "~/features/guide/articles.ts"
import { expect } from "~/helpers/expect.ts"
import { getMeta } from "~/meta.ts"
import { LoadingPlaceholder } from "~/ui/LoadingPlaceholder.tsx"

export const meta: MetaFunction = ({ params }) => {
	const document = getGuideArticle(expect(params.article))
	return getMeta({ title: document?.title })
}

export default function RulesDocumentPage() {
	const params = useParams()
	const article = getGuideArticle(expect(params.article))
	return article ?
			<main>
				<h1>{article.title}</h1>
				<Suspense fallback={<LoadingPlaceholder />}>
					<article.content />
				</Suspense>
			</main>
		:	<main>
				<h1>404</h1>
				<p>Document not found</p>
			</main>
}
