import { LucideHeartCrack } from "lucide-react"
import { Indicator } from "~/ui/Indicator"

export function PhysicalStressIndicator({ value }: { value: number }) {
	return (
		<Indicator
			label="Physical Stress"
			icon={<LucideHeartCrack />}
			value={value}
			className="text-orange-400"
		/>
	)
}
