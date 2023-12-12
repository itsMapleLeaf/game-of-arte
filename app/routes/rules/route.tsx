import { Outlet } from "@remix-run/react"
import {
	LucideBarChart2,
	LucideDices,
	LucideShapes,
	LucideTrendingUp,
	LucideVenetianMask,
} from "lucide-react"
import { Button } from "~/components/Button.tsx"
import { container } from "~/styles/container.ts"

export default function RulesRoute() {
	return (
		<div className={container("flex flex-row items-start gap-4 py-8")}>
			<nav className="sticky top-20 flex flex-col children:justify-start">
				<Button appearance="clear" icon={LucideVenetianMask}>
					Character Creation
				</Button>
				<Button appearance="clear" icon={LucideShapes}>
					Archetypes
				</Button>
				<Button appearance="clear" icon={LucideBarChart2}>
					Attributes
				</Button>
				<Button appearance="clear" icon={LucideDices}>
					Action Rolls
				</Button>
				<Button appearance="clear" icon={LucideTrendingUp}>
					Progression
				</Button>
			</nav>
			<section>
				<div className="h-[200dvh]" />
				<p>e</p>
				<Outlet />
			</section>
		</div>
	)
}
