import { useState } from "react"
import { type ZodTypeDef, z } from "zod"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import type { KeyOfUnion } from "./types.ts"

type FormErrors<Keys extends PropertyKey> = {
	formErrors?: string[]
	fieldErrors?: Partial<Record<Keys, string[]>>
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
	const [errors, setErrors] = useState<FormErrors<KeyOfUnion<Input>>>()

	const [submit, submitState] = useAsyncCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			setErrors(undefined)

			const result = await schema.safeParseAsync(
				Object.fromEntries(new FormData(event.currentTarget)),
			)
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
				console.error(result.error.flatten())
				setErrors(
					result.error.flatten() as unknown as FormErrors<KeyOfUnion<Input>>,
				)
			}
		},
	)

	const inputProps = <K extends KeyOfUnion<Input>>(name: K) => ({
		name,
		defaultValue: defaultValues[name],
		errors: errors?.fieldErrors?.[name],
	})

	const textInputProps = <K extends KeyOfUnion<Input>>(name: K) => ({
		name,
		type: "text",
		defaultValue: defaultValues[name],
		errors: errors?.fieldErrors?.[name],
	})

	const numberInputProps = <K extends KeyOfUnion<Input>>(name: K) => ({
		name,
		type: "number",
		defaultValue: defaultValues[name],
		errors: errors?.fieldErrors?.[name],
	})

	const checkboxProps = <K extends KeyOfUnion<Input>>(name: K) => ({
		name,
		type: "checkbox",
		defaultValue: defaultValues[name],
		errors: errors?.fieldErrors?.[name],
	})

	return {
		submit,
		inputProps,
		textInputProps,
		numberInputProps,
		checkboxProps,
		isSubmitting: submitState.isLoading,
		hasErrors: !!errors,
		formErrors: errors?.formErrors,
		fieldErrors: errors?.fieldErrors,
	}
}
