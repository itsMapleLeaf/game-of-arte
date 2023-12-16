import { Outlet } from "@remix-run/react"
import { getGuideArticles } from "~/features/guide/articles"
import { NavLinkButton } from "~/ui/NavLinkButton.tsx"
import { container } from "~/ui/styles.ts"

export default function GuideRoute() {
	return (
		<div className={container("flex flex-row items-start gap-4 py-8")}>
			<nav className="sticky top-20 flex flex-col children:justify-start">
				{getGuideArticles()
					.map((article) => (
						<NavLinkButton
							key={article.slug}
							to={`/guide/${article.slug}`}
							appearance="clear"
							icon={article.icon}
						>
							{article.title}
						</NavLinkButton>
					))
					.array()}
			</nav>
			<section className="flex-1">
				<Outlet />
			</section>
		</div>
	)
}
