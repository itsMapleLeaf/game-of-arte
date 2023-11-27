import { LucideHeartCrack } from "lucide-react"
import { Indicator } from "~/components/Indicator.tsx"

export function PhysicalStressIndicator({ value }: { value: number }) {
	return (
		<Indicator
			label="Physical Stress"
			icon={<LucideHeartCrack />}
			value={value}
			className="text-red-400"
		/>
	)
}
