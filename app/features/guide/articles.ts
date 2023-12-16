import type { MDXModule } from "mdx/types"
import {
	type Article,
	createArticlesFromModules,
} from "~/features/wiki/articles.tsx"
import type { ExtendedIterable } from "~/helpers/iterable.ts"

export function getGuideArticles(): ExtendedIterable<Article> {
	return createArticlesFromModules({
		...import.meta.glob<MDXModule>("./articles/*.md"),
		...import.meta.glob<MDXModule>("./articles/*.mdx"),
	})
}

const guideArticleMap = getGuideArticles().toMap((article) => [
	article.slug,
	article,
])
export function getGuideArticle(slug: string): Article | undefined {
	return guideArticleMap.get(slug)
}
