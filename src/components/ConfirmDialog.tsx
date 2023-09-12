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
				<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 flex flex-col overflow-y-auto p-4">
					<Dialog.Content
						className={panel("border rounded-md shadow-md p-4 m-auto")}
					>
						<Dialog.Title className="text-2xl font-light mb-2">
							{title}
						</Dialog.Title>

						<Dialog.Description className="my-4">
							{description}
						</Dialog.Description>

						<div className="flex justify-end gap-2">
							<Dialog.Close className="px-3 h-10 leading-none hover:bg-base-800 rounded-md transition">
								{cancelText}
							</Dialog.Close>
							<Dialog.Close
								type="button"
								className="bg-accent-700 hover:bg-accent-800 text-white px-4 py-2 rounded transition"
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
