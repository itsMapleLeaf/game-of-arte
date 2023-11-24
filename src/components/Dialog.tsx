import * as DialogBase from "@radix-ui/react-dialog"
import { LucideX } from "lucide-react"
import { twMerge } from "~/styles/twMerge.ts"
import { panel } from "../styles/panel.ts"

export const Dialog = DialogBase.Root
export const DialogTrigger = DialogBase.Trigger
export const DialogTitle = DialogBase.Title
export const DialogDescription = DialogBase.Description
export const DialogClose = DialogBase.Close

export function DialogContent(props: DialogBase.DialogContentProps) {
	return (
		<DialogBase.Portal>
			<DialogBase.Overlay className="fixed inset-0 flex flex-col bg-black bg-opacity-75 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in">
				<DialogBase.Content
					{...props}
					className={twMerge(
						"m-auto flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2",
						props.className,
					)}
				>
					<DialogClose className="-mx-2 self-end rounded p-2 opacity-50 transition hover:opacity-100">
						<LucideX />
					</DialogClose>
					{props.children}
				</DialogBase.Content>
			</DialogBase.Overlay>
		</DialogBase.Portal>
	)
}

export function DialogPanel(props: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={panel(
				"rounded-md border bg-base-950 shadow-md",
				props.className,
			)}
		/>
	)
}

export function SimpleDialogContent({
	title,
	children,
}: {
	title: React.ReactNode
	children: React.ReactNode
}) {
	return (
		<DialogContent className="w-full max-w-md">
			<DialogPanel className="flex flex-col gap-3 p-4">
				<DialogTitle className="text-center text-3xl font-light">
					{title}
				</DialogTitle>
				{children}
			</DialogPanel>
		</DialogContent>
	)
}
