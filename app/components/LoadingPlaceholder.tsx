import { LucideLoader2, type LucideProps } from "lucide-react"
import { type ReactElement, type ReactNode, Suspense } from "react"
import { twMerge } from "tailwind-merge"

export function LoadingSpinner(props: LucideProps) {
	return (
		<LucideLoader2
			{...props}
			className={twMerge("animate-spin", props.className)}
		/>
	)
}

export function LoadingPlaceholder({
	className,
	children,
}: {
	className?: string
	children?: string | ReactElement
}) {
	return (
		<div
			className={twMerge(
				"flex flex-col items-center justify-center gap-3 p-8",
				className,
			)}
		>
			<LoadingSpinner className="s-12" aria-hidden />
			{typeof children === "string" ?
				<p className="text-xl font-light">{children}</p>
			:	children}
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
