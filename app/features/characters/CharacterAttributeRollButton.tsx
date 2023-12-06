import { LucideDices } from "lucide-react"
import { useState } from "react"
import { SrOnly } from "~/components/SrOnly.tsx"
import {
	Popover,
	PopoverPanel,
	PopoverTrigger,
} from "../../components/Popover.tsx"
import { CharacterAttributeRollForm } from "./CharacterAttributeRollForm.tsx"
import type { Attribute } from "./attributes.ts"

export function CharacterAttributeRollButton({
	attribute,
}: {
	attribute: Attribute
}) {
	const [popoverOpen, setPopoverOpen] = useState(false)
	return (
		<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
			<PopoverTrigger
				type="button"
				className="rounded-md p-2 transition hover:bg-base-800"
			>
				<LucideDices />
				<SrOnly>Roll {attribute.name}</SrOnly>
			</PopoverTrigger>
			<PopoverPanel
				className="w-64 p-4"
				// adding dice can sometimes cause layout shift,
				// so we'll make it align end and disable collision avoidance
				// to prevent that
				side="bottom"
				align="end"
				avoidCollisions={false}
			>
				<CharacterAttributeRollForm
					attribute={attribute}
					onSuccess={() => setPopoverOpen(false)}
				/>
			</PopoverPanel>
		</Popover>
	)
}
