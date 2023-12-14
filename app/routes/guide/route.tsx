import { Link, Outlet } from "@remix-run/react"
import { Button } from "~/components/Button.tsx"
import { guideDocuments } from "~/features/guide/data"
import { container } from "~/styles/container.ts"

export default function RulesRoute() {
	return (
		<div className={container("flex flex-row items-start gap-4 py-8")}>
			<nav className="sticky top-20 flex flex-col children:justify-start">
				{Object.entries(guideDocuments).map(([key, document]) => (
					<Button key={key} appearance="clear" icon={document.icon} asChild>
						<Link to={`/guide/${key}`} prefetch="intent">
							{document.title}
						</Link>
					</Button>
				))}
			</nav>
			<section className="flex-1">
				<Outlet />
			</section>
		</div>
	)
}
