import { LucideConstruction } from "lucide-react"
import { EmptyState } from "~/components/EmptyState.tsx"

export default function SpellbookPage() {
	return (
		<EmptyState icon={LucideConstruction} className="py-16">
			Under construction. Check back later!
		</EmptyState>
	)
}
