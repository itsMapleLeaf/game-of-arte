import type { ReactNode } from "react"
import { Button } from "./Button.tsx"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from "./Dialog.tsx"

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
	onConfirm: () => unknown
	children: React.ReactNode
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogPanel className="p-4">
					<DialogTitle className="mb-2 text-2xl font-light">
						{title}
					</DialogTitle>
					<DialogDescription className="my-4">{description}</DialogDescription>
					<div className="flex justify-end gap-2">
						<DialogClose asChild>
							<Button appearance="clear">{cancelText}</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button appearance="solid" onClick={onConfirm}>
								{confirmText}
							</Button>
						</DialogClose>
					</div>
				</DialogPanel>
			</DialogContent>
		</Dialog>
	)
}
