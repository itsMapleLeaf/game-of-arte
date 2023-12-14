import { Link, useMatch } from "@remix-run/react"
import type { RemixLinkProps } from "@remix-run/react/dist/components"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { Button, type ButtonProps } from "~/ui/Button"
import { twMerge } from "~/ui/twMerge"

export interface NavLinkButtonProps extends StrictOmit<ButtonProps, "asChild"> {
	to: string
	prefetch?: RemixLinkProps["prefetch"]
}

export const NavLinkButton = autoRef(function NavLinkButton({
	to,
	prefetch,
	children,
	...props
}: NavLinkButtonProps) {
	const match = useMatch(to)
	return (
		<Button
			{...props}
			className={twMerge(match && "text-accent-400", props.className)}
			asChild
		>
			<Link to={to} prefetch={prefetch}>
				{children}
			</Link>
		</Button>
	)
})
