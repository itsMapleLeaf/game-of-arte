import { LucideCheck } from "lucide-react"
import {
	type ReactElement,
	cloneElement,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react"
import { twMerge } from "tailwind-merge"
import { type ZodTypeDef, z } from "zod"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"
import { useEffectEvent } from "~/helpers/useEffectEvent.ts"
import { usePromise } from "~/helpers/usePromise.ts"
import { Button, type ButtonProps } from "./Button.tsx"
import { Field, FieldErrors, type FieldPropsBase } from "./Field.tsx"

// biome-ignore lint/suspicious/noExplicitAny: needs to match the zod type
type AllKeys<T> = T extends any ? keyof T : never

type FormErrors<Input> = {
	formErrors: string[]
	fieldErrors: Partial<Record<AllKeys<Input>, string[]>>
}

export function useForm<
	Output,
	Input extends Record<string, string | number | boolean>,
>({
	schema,
	onSubmit,
}: {
	schema: z.ZodType<Output, ZodTypeDef, Input>
	onSubmit: (values: Output) => unknown
}) {
	const formRef = useRef<HTMLFormElement>(null)

	const [submitted, setSubmitted] = useState(false)
	const [parseResultPromise, setParseResultPromise] =
		useState<Promise<z.SafeParseReturnType<Input, Output>>>()

	const parseState = usePromise(parseResultPromise)

	const [submit, submitState] = useAsyncCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			setSubmitted(true)
			const data =
				parseState.status === "fulfilled" &&
				parseState.value?.success === true &&
				parseState.value.data
			if (data) {
				await onSubmit(data)
			}
		},
	)

	const parseError =
		parseState.status === "fulfilled" &&
		parseState.value?.success === false &&
		parseState.value.error

	const hasSubmitError = !!(submitState.isError && submitState.error)

	const formErrors = useMemo(() => {
		const formErrors: FormErrors<Input> | undefined =
			parseError ? parseError.flatten() : undefined
		if (hasSubmitError && formErrors?.formErrors.length === 0) {
			formErrors.formErrors.push(
				"Something went wrong. Check for issues and try again.",
			)
		}
		return formErrors
	}, [parseError, hasSubmitError])

	const isPending = parseState.status === "pending" || submitState.isLoading

	const formProps = useMemo(
		() => ({
			onSubmit: submit,
			ref: formRef,
		}),
		[submit],
	)

	const handleChange = useEffectEvent(() => {
		if (!formRef.current) {
			throw new Error("Form ref not set")
		}
		setParseResultPromise(
			schema.safeParseAsync(Object.fromEntries(new FormData(formRef.current))),
		)
	})

	const inputProps = useCallback(
		<Name extends AllKeys<Input>, OnChangeArgs extends unknown[]>(
			name: Name,
			options: { onChange?: (...args: OnChangeArgs) => void } = {},
		) => ({
			name,
			errors: formErrors?.fieldErrors?.[name],
			onChange: (...args: OnChangeArgs) => {
				handleChange()
				options.onChange?.(...args)
			},
		}),
		[formErrors, handleChange],
	)

	const Form = useCallback(
		function Form({ children, ...props }: React.ComponentPropsWithRef<"form">) {
			return (
				<form
					{...props}
					{...formProps}
					className={twMerge("grid gap-4", props.className)}
				>
					{children}
					<FieldErrors
						className="text-center"
						errors={formErrors?.formErrors}
					/>
				</form>
			)
		},
		[formProps, formErrors?.formErrors],
	)

	const FormField = useCallback(
		function FormField({
			input,
			...props
		}: Partial<FieldPropsBase> & {
			name: AllKeys<Input>
			input: ReactElement
		}) {
			return (
				<Field {...props}>
					{cloneElement(input, inputProps(props.name, input.props))}
					<FieldErrors errors={formErrors?.fieldErrors?.[props.name]} />
				</Field>
			)
		},
		[inputProps, formErrors?.fieldErrors],
	)

	const FormButton = useCallback(
		function FormButton({
			children = "Submit",
			icon = LucideCheck,
			...props
		}: ButtonProps) {
			return (
				<Button
					type="submit"
					appearance="solid"
					icon={icon}
					pending={isPending}
					{...props}
				>
					{children}
				</Button>
			)
		},
		[isPending],
	)

	return {
		formProps,
		inputProps,
		isPending,
		hasErrors: submitted ? !!formErrors : false,
		formErrors: submitted ? formErrors?.formErrors : undefined,
		fieldErrors: submitted ? formErrors?.fieldErrors : undefined,
		Form,
		Field: FormField,
		Button: FormButton,
	}
}
