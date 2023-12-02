import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { Checkbox } from "./Checkbox.tsx"
import {
	Field,
	FieldDescription,
	FieldInput,
	FieldLabel,
	FieldLabelTooltip,
	type FieldPropsBase,
} from "./Field.tsx"

export interface CheckboxFieldProps
	extends React.ComponentPropsWithRef<"input">,
		StrictOmit<FieldPropsBase, "asChild" | "labelText"> {
	label: string | React.ReactElement
}

export const CheckboxField = autoRef(function CheckboxField({
	label,
	labelTooltip,
	description,
	className,
	...props
}: CheckboxFieldProps) {
	let labelElement = <FieldLabel>{label}</FieldLabel>
	if (labelTooltip) {
		labelElement = (
			<FieldLabelTooltip content={labelTooltip}>
				{labelElement}
			</FieldLabelTooltip>
		)
	}

	return (
		<Field className={className}>
			<div className="flex items-center gap-2">
				{labelElement}
				<FieldInput asChild>
					<Checkbox {...props} />
				</FieldInput>
			</div>
			{description && <FieldDescription>{description}</FieldDescription>}
		</Field>
	)
})
