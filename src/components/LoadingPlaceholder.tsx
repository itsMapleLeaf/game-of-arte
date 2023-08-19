import { LucideLoader2, type LucideProps } from "lucide-react"
import { Suspense, type ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function LoadingSpinner(props: LucideProps) {
	return (
		<LucideLoader2
			{...props}
			className={twMerge("animate-spin s-12", props.className)}
		/>
	)
}

export function LoadingPlaceholder(props: { className?: string }) {
	return (
		<div
			className={twMerge(
				"flex flex-col items-center justify-center p-8",
				props.className,
			)}
		>
			<LoadingSpinner />
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
