import { Link, useMatch } from "@remix-run/react"
import type { RemixLinkProps } from "@remix-run/react/dist/components"
import { autoRef } from "~/helpers/autoRef.tsx"
import type { StrictOmit } from "~/helpers/types.ts"
import { Button, type ButtonProps } from "~/ui/Button"

export interface NavLinkButtonProps extends StrictOmit<ButtonProps, "asChild"> {
	to: string
	partial?: boolean
	prefetch?: RemixLinkProps["prefetch"]
}

export const NavLinkButton = autoRef(function NavLinkButton({
	to,
	partial,
	prefetch,
	children,
	...props
}: NavLinkButtonProps) {
	const match = useMatch(partial ? `${to}/*` : to)
	return (
		<Button {...props} color={match ? "accent" : "default"} asChild>
			<Link to={to} prefetch={prefetch}>
				{children}
			</Link>
		</Button>
	)
})
