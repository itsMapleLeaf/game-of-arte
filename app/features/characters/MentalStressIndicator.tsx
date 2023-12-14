import { LucideBrain } from "lucide-react"
import { Indicator } from "~/ui/Indicator"

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
