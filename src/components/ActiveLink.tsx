import { Link, type LinkProps, useRoute } from "wouter"

export function ActiveLink({
	href,
	children,
	...props
}: LinkProps & { href: string }) {
	const [isActive] = useRoute(href)
	return (
		<Link href={href}>
			<a aria-current={isActive ? "page" : undefined} {...props}>
				{children}
			</a>
		</Link>
	)
}
