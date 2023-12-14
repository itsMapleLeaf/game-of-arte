import { Link, Outlet } from "@remix-run/react"
import { Button } from "~/components/Button.tsx"
import { getGuideArticles } from "~/features/guide/articles"
import { container } from "~/styles/container.ts"

export default function RulesRoute() {
	return (
		<div className={container("flex flex-row items-start gap-4 py-8")}>
			<nav className="sticky top-20 flex flex-col children:justify-start">
				{getGuideArticles()
					.map((article) => (
						<Button
							key={article.slug}
							appearance="clear"
							icon={article.icon}
							asChild
						>
							<Link to={`/guide/${article.slug}`} prefetch="intent">
								{article.title}
							</Link>
						</Button>
					))
					.array()}
			</nav>
			<section className="flex-1">
				<Outlet />
			</section>
		</div>
	)
}
