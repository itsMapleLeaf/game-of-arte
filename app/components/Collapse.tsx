import { LucideChevronLeft } from "lucide-react"
import type { ComponentPropsWithRef } from "react"
import { autoRef } from "~/helpers/autoRef.tsx"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { twMerge } from "~/styles/twMerge.ts"

export const Collapse = autoRef(function Collapse(
	props: ComponentPropsWithRef<"details">,
) {
	return (
		<details
			{...props}
			open={props.open ?? false}
			className={twMerge("collapse-root", props.className)}
		/>
	)
})

export const CollapsePersisted = autoRef(function CollapsePersisted({
	defaultOpen = false,
	persistenceKey,
	...props
}: ComponentPropsWithRef<"details"> & {
	defaultOpen?: boolean
	persistenceKey: string
}) {
	const [open, setOpen] = useLocalStorageState(persistenceKey, (input) =>
		typeof input === "boolean" ? input : defaultOpen,
	)
	return (
		<Collapse
			{...props}
			open={open}
			onToggle={(event) => setOpen(event.currentTarget.open)}
		/>
	)
})

export const CollapseSummary = autoRef(function CollapseButton({
	children,
	...props
}: ComponentPropsWithRef<"summary">) {
	return (
		<summary
			{...props}
			className={twMerge(
				"flex cursor-pointer select-none flex-row items-center opacity-100 transition hover:text-accent-400",
				props.className,
			)}
		>
			<div className="flex-1">{children}</div>
			<LucideChevronLeft className="transition-transform [.collapse-root[open]>summary>&]:-rotate-90" />
		</summary>
	)
})
