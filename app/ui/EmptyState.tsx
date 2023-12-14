import { twMerge } from "~/ui/twMerge"

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
				"flex flex-col items-center justify-center gap-2 p-4 text-center ",
				className,
			)}
		>
			{Icon && <Icon className="opacity-40 s-12" aria-hidden />}
			<p className="text-lg/tight font-light opacity-60 [text-wrap:balance]">
				{children}
			</p>
		</div>
	)
}
