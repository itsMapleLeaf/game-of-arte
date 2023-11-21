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
			<DialogBase.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in fixed inset-0 flex flex-col overflow-y-auto bg-black bg-opacity-75 p-4">
				<DialogBase.Content
					{...props}
					className={twMerge(
						"data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 data-[state=closed]:animate-out m-auto flex flex-col",
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
			className={panel("rounded-md border shadow-md", props.className)}
		/>
	)
}
