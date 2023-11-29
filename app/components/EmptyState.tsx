import { twMerge } from "~/styles/twMerge.ts"

export function EmptyState({
	children,
	className,
	icon: Icon,
}: {
	children: React.ReactNode
	className?: string
	icon:
		| ((props: { className: string; "aria-hidden": true }) => React.ReactNode)
		| undefined
}) {
	return (
		<div
			className={twMerge(
				"flex flex-col items-center justify-center gap-2 p-4 opacity-50",
				className,
			)}
		>
			{Icon && <Icon className="s-12" aria-hidden />}
			<p className="text-lg font-light">{children}</p>
		</div>
	)
}
