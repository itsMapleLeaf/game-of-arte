import { api } from "convex/_generated/api"
import { type Doc } from "convex/_generated/dataModel.js"
import { useMutation } from "convex/react"
import { renderSlot, type Slot } from "../../helpers/slot.ts"

export function DataInput<ExtraProps extends object>({
	character,
	dataKey,
	children,
	...props
}: ExtraProps & {
	character: Doc<"characters">
	dataKey: string
	children: Slot<
		Omit<ExtraProps, "character" | "dataKey" | "children"> & {
			value: string | number | undefined
			onChange: (event: React.ChangeEvent<{ value: string }>) => void
			onChangeValue: (value: string | number) => void
		}
	>
}) {
	const update = useMutation(api.characters.updateData).withOptimisticUpdate(
		(store, args) => {
			store.setQuery(
				api.characters.get,
				{ id: character._id },
				{
					...character,
					data: { ...character.data, [dataKey]: args.data[dataKey]! },
				},
			)
		},
	)

	return renderSlot(children, {
		...props,
		value: character.data[dataKey],
		onChange: (event) => {
			void update({
				id: character._id,
				data: { [dataKey]: event.currentTarget.value },
			})
		},
		onChangeValue: (value) => {
			void update({
				id: character._id,
				data: { [dataKey]: value },
			})
		},
	})
}
