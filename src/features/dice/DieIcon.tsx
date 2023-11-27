import {
	LucideDiamond,
	LucideHexagon,
	LucidePentagon,
	type LucideProps,
	LucideSquare,
	LucideTriangle,
} from "lucide-react"

export function DieIcon({ sides, ...props }: { sides: number } & LucideProps) {
	const Component =
		sides === 4 ? LucideTriangle
		: sides === 6 ? LucideSquare
		: sides === 8 ? LucideDiamond
		: sides === 12 ? LucidePentagon
		: LucideHexagon
	return <Component {...props} />
}
