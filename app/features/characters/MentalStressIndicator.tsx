import { LucideBrain } from "lucide-react"
import { Indicator } from "~/components/Indicator.tsx"

export function MentalStressIndicator({ value }: { value: number }) {
	return (
		<Indicator
			label="Mental Stress"
			icon={<LucideBrain />}
			value={value}
			className="text-purple-400"
		/>
	)
}
