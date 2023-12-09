import { isObject, mapValues } from "lodash-es"
import { LucideCheck } from "lucide-react"
import {
	type ReactElement,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { Button, type ButtonProps } from "./Button.tsx"
import {
	Field,
	FieldErrors,
	FieldInput,
	type FieldPropsBase,
} from "./Field.tsx"

// biome-ignore lint/suspicious/noExplicitAny: needs to match the zod type
type AllKeys<T> = T extends any ? keyof T : never

type FormSchema = z.SomeZodObject | z.ZodEffects<z.SomeZodObject>

type FormState<Schema extends FormSchema = FormSchema> = ReturnType<
	typeof useForm<Schema>
>

export function useForm<Schema extends FormSchema>({
	schema,
	defaultValues,
	onSubmit,
}: {
	schema: Schema
	defaultValues?: Partial<z.input<Schema>>
	onSubmit: (values: z.output<Schema>) => unknown
}) {
	const [values, setValues] = useState<Partial<z.input<Schema>>>(
		defaultValues ?? {},
	)

	const [validate, validation] = useAsyncCallback(
		(values: Partial<z.input<Schema>>) => schema.parseAsync(values),
	)

	useEffect(() => {
		validate(values)
	}, [validate, values])

	const setValue = <Key extends AllKeys<z.input<Schema>>>(
		key: Key,
		value: z.input<Schema>[Key],
	) => {
		setValues({ ...values, [key]: value })
	}

	const [submit, submitState] = useAsyncCallback(async () => {
		if (validation.isSuccess && validation.data) {
			await onSubmit(validation.data)
		}
	})

	const pending = validation.isLoading || submitState.isLoading

	let formErrors: string[] | undefined
	let fieldErrors:
		| Partial<Record<AllKeys<z.input<Schema>>, string[]>>
		| undefined

	if (!submitState.isIdle && validation.isError) {
		if (validation.error instanceof z.ZodError) {
			const flattened = validation.error.flatten()
			formErrors = flattened.formErrors
			fieldErrors = flattened.fieldErrors as Partial<
				Record<AllKeys<z.input<Schema>>, string[]>
			>
		} else {
			formErrors = ["Something went wrong. Check for issues and try again."]
		}
	}

	if (submitState.isError && formErrors?.length === 0) {
		formErrors = ["Something went wrong. Check for issues and try again."]
	}

	const shape = "shape" in schema ? schema.shape : schema.innerType().shape
	const names = mapValues(shape, (_, key) => key) as {
		[K in AllKeys<z.input<Schema>>]: K
	}

	const inputProps = <Name extends AllKeys<z.input<Schema>>>(name: Name) => ({
		value: values[name],
		onChange: (
			eventOrValue:
				| z.input<Schema>[Name]
				| {
						currentTarget: { value: z.input<Schema>[Name] }
				  },
		) => {
			const value =
				isObject(eventOrValue) && "currentTarget" in eventOrValue ?
					eventOrValue.currentTarget.value
				:	eventOrValue

			setValue(name, value)
		},
	})

	return {
		names,
		values,
		setValue,
		validation,
		submit,
		submitState,
		pending,
		formErrors,
		fieldErrors,
		inputProps,
	}
}

const FormContext = createContext<FormState | undefined>(undefined)

function useFormContext() {
	const context = useContext(FormContext)
	if (!context) {
		throw new Error("Form context not set")
	}
	return context
}

export function Form({
	children,
	state,
	...props
}: React.ComponentPropsWithRef<"form"> & {
	state: FormState
}) {
	return (
		<form
			{...props}
			onSubmit={(event) => {
				event.preventDefault()
				state.submit()
				props.onSubmit?.(event)
			}}
			className={twMerge("grid gap-4", props.className)}
		>
			<FormContext.Provider value={state}>{children}</FormContext.Provider>
			<FieldErrors className="text-center" errors={state.formErrors} />
		</form>
	)
}

export function FormField({
	name,
	children,
	...props
}: FieldPropsBase & { name: string; children: ReactElement }) {
	const form = useFormContext()
	return (
		<Field errors={form.fieldErrors?.[name]} {...props}>
			<FieldInput {...form.inputProps(name)} asChild>
				{children}
			</FieldInput>
		</Field>
	)
}

export function FormButton({
	children = "Submit",
	icon = LucideCheck,
	...props
}: ButtonProps) {
	const form = useFormContext()
	return (
		<Button
			type="submit"
			appearance="solid"
			icon={icon}
			pending={form.pending}
			{...props}
		>
			{children}
		</Button>
	)
}
