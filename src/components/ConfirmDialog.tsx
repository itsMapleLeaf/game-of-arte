import * as Dialog from "@radix-ui/react-dialog"
import type { ReactNode } from "react"
import { panel } from "../styles/panel.ts"

export function ConfirmDialog({
	title,
	description,
	cancelText = "Never Mind",
	confirmText = "Confirm",
	onConfirm,
	children,
}: {
	title: ReactNode
	description: ReactNode
	cancelText?: ReactNode
	confirmText?: ReactNode
	onConfirm: () => void
	children: React.ReactNode
}) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 flex flex-col overflow-y-auto bg-black bg-opacity-75 p-4">
					<Dialog.Content
						className={panel("m-auto rounded-md border p-4 shadow-md")}
					>
						<Dialog.Title className="mb-2 text-2xl font-light">
							{title}
						</Dialog.Title>

						<Dialog.Description className="my-4">
							{description}
						</Dialog.Description>

						<div className="flex justify-end gap-2">
							<Dialog.Close className="h-10 rounded-md px-3 leading-none transition hover:bg-base-800">
								{cancelText}
							</Dialog.Close>
							<Dialog.Close
								type="button"
								className="rounded bg-accent-700 px-4 py-2 text-white transition hover:bg-accent-800"
								onClick={onConfirm}
							>
								{confirmText}
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
