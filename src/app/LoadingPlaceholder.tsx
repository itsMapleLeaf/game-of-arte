import { LucideLoader2 } from "lucide-react"
import { type ReactNode, Suspense } from "react"
import { twMerge } from "tailwind-merge"

export function LoadingPlaceholder(props: { className?: string }) {
	return (
		<div
			className={twMerge(
				"flex items-center justify-center p-8",
				props.className,
			)}
		>
			<LucideLoader2 className="animate-spin s-12" />
		</div>
	)
}

export function LoadingSuspense(props: {
	className?: string
	children: ReactNode
}) {
	return (
		<Suspense fallback={<LoadingPlaceholder className={props.className} />}>
			{props.children}
		</Suspense>
	)
}
