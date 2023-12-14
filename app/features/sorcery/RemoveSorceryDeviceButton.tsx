import type { Doc } from "convex/_generated/dataModel"
import { LucideX } from "lucide-react"
import { Button } from "~/ui/Button.tsx"
import { ConfirmDialog } from "~/ui/ConfirmDialog"
import { useSetSorceryDeviceMutation } from "./useSetSorceryDeviceMutation"

export function RemoveSorceryDeviceButton({
	character,
}: {
	character: Doc<"characters">
}) {
	const setSorceryDevice = useSetSorceryDeviceMutation()

	return (
		<ConfirmDialog
			title="Remove Sorcery Device"
			description="Are you sure you want to remove this character's sorcery device?"
			confirmText="Remove"
			onConfirm={() => {
				setSorceryDevice({
					id: character._id,
					sorceryDevice: null,
				})
			}}
		>
			<Button appearance="outline">
				<LucideX /> Remove Sorcery Device
			</Button>
		</ConfirmDialog>
	)
}
