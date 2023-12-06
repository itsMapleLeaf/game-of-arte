import { useState } from "react"
import { type ZodTypeDef, z } from "zod"
import { isObject } from "~/helpers/is.ts"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"

type EventLike = {
	currentTarget: {
		type: string
		value: string
		valueAsNumber: number
		checked: boolean
	}
}

export function useForm<
	Output,
	Input extends Record<string, string | number | boolean>,
>({
	schema,
	defaultValues = {},
	onSubmit,
}: {
	schema: z.ZodType<Output, ZodTypeDef, Input>
	defaultValues?: Partial<Input>
	onSubmit: (values: Output) => unknown
}) {
	const [values, setValues] =
		useState<Partial<Record<string, string | number | boolean>>>(defaultValues)

	const [errors, setErrors] = useState<z.typeToFlattenedError<Input>>()

	const [submit, submitState] = useAsyncCallback(
		async (event: React.FormEvent) => {
			event.preventDefault()
			setErrors(undefined)

			const result = await schema.safeParseAsync(values)
			if (result.success) {
				try {
					await onSubmit(result.data)
				} catch (error) {
					console.error(error)
					setErrors({
						formErrors: ["Something went wrong, try again."],
						fieldErrors: {},
					})
				}
			} else {
				setErrors(result.error.flatten())
			}
		},
	)

	const getValue = <V,>(
		eventOrValue: V | EventLike,
	): string | number | boolean | V => {
		if (!isObject(eventOrValue)) {
			return eventOrValue
		}

		const { currentTarget } = eventOrValue
		if (currentTarget.type === "checkbox" || currentTarget.type === "radio") {
			return currentTarget.checked
		}
		if (currentTarget.type === "number") {
			return currentTarget.valueAsNumber
		}
		return currentTarget.value
	}

	const baseProps = <K extends keyof Input>(name: string) => ({
		name,
		onChange: (eventOrValue: Input[K] | EventLike) => {
			const value = getValue(eventOrValue)
			setValues((prev) => ({ ...prev, [name]: value }))
		},
	})

	const textInputProps = <K extends Extract<keyof Input, string>>(name: K) => ({
		...baseProps(name),
		type: "text",
		value: values[name] === undefined ? "" : String(values[name]),
	})

	const numberInputProps = <K extends Extract<keyof Input, string>>(
		name: K,
	) => ({
		...baseProps(name),
		type: "number",
		value: values[name] === undefined ? 0 : Number(values[name]),
	})

	const checkboxProps = <K extends Extract<keyof Input, string>>(name: K) => ({
		...baseProps(name),
		type: "checkbox",
		value: Boolean(values[name]),
	})

	const setValue = <K extends keyof Input>(name: K, value: Input[K]) => {
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	return {
		values,
		setValue,
		submit,
		textInputProps,
		numberInputProps,
		checkboxProps,
		isSubmitting: submitState.isLoading,
		formErrors: errors?.formErrors,
		fieldErrors: errors?.fieldErrors,
	}
}
