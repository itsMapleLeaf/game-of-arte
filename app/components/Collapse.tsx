import * as Ariakit from "@ariakit/react"
import { LucideChevronLeft } from "lucide-react"
import { autoRef } from "~/helpers/autoRef.tsx"
import { useLocalStorageState } from "~/helpers/useLocalStorageState.tsx"
import { twMerge } from "~/styles/twMerge.ts"

export interface CollapseProps extends Ariakit.DisclosureProviderProps {
	persistenceKey: string
}

export const Collapse = autoRef(function PersistedCollapse({
	defaultOpen = false,
	persistenceKey,
	...props
}: CollapseProps) {
	const [open, setOpen] = useLocalStorageState(persistenceKey, (input) =>
		typeof input === "boolean" ? input : defaultOpen,
	)
	return (
		<Ariakit.DisclosureProvider
			animated
			{...props}
			open={props.open ?? open}
			setOpen={props.setOpen ?? setOpen}
		/>
	)
})

export interface CollapseButtonProps extends Ariakit.DisclosureProps {
	children?: React.ReactNode
}

export const CollapseButton = autoRef(function CollapseButton({
	children,
	...props
}: CollapseButtonProps) {
	return (
		<Ariakit.Disclosure
			{...props}
			className={twMerge(
				"group flex w-full cursor-pointer select-none flex-row items-center opacity-100 transition hover:text-accent-400",
				props.className,
			)}
		>
			<div className="flex-1">{children}</div>
			<LucideChevronLeft className="transition-transform group-aria-expanded:-rotate-90" />
		</Ariakit.Disclosure>
	)
})

export const CollapseContent = autoRef(function CollapseContent({
	children,
	className,
	...props
}: Omit<Ariakit.DisclosureContentProps, "children"> & {
	children?: React.ReactNode
}) {
	return (
		<Ariakit.DisclosureContent
			{...props}
			className="group grid overflow-hidden transition-[grid-template-rows] duration-300 data-[enter]:grid-rows-[1fr] data-[leave]:grid-rows-[0fr]"
		>
			<div className={twMerge("min-h-0 min-w-full", className)}>{children}</div>
		</Ariakit.DisclosureContent>
	)
})

export const useCollapseContext = Ariakit.useDisclosureContext
