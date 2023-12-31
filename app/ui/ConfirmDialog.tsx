import { type ReactNode, useState } from "react"
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
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogPanel className="p-4">
					<DialogTitle className="mb-2 text-2xl font-light">
						{title}
					</DialogTitle>
					<DialogDescription className="my-4">{description}</DialogDescription>
					<div className="flex justify-end gap-2">
						<DialogClose asChild>
							<Button appearance="clear" color="default">
								{cancelText}
							</Button>
						</DialogClose>
						<Button
							appearance="solid"
							color="negative"
							onClick={async () => {
								await onConfirm()
								setOpen(false)
							}}
						>
							{confirmText}
						</Button>
					</div>
				</DialogPanel>
			</DialogContent>
		</Dialog>
	)
}
