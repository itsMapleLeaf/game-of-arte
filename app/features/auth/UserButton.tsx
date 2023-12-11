import { SignOutButton } from "@clerk/remix"
import { LucideLogOut, LucideUserCog2 } from "lucide-react"
import { ExternalLink } from "~/components/ExternalLink.tsx"
import { Menu, MenuItem, MenuPanel, MenuTrigger } from "~/components/Menu.tsx"
import { env } from "~/env.ts"

export function UserButton({ user }: { user: { imageUrl: string } }) {
	return (
		<Menu>
			<MenuTrigger className="rounded-full transition ring-no-inset hover:opacity-75">
				<img src={user.imageUrl} alt="" className="rounded-full s-8" />
			</MenuTrigger>
			<MenuPanel align="end">
				<MenuItem icon={LucideUserCog2} asChild>
					<ExternalLink href={new URL("/user", env.VITE_CLERK_DOMAIN).href}>
						My Account
					</ExternalLink>
				</MenuItem>
				<SignOutButton>
					<MenuItem icon={LucideLogOut}>Sign Out</MenuItem>
				</SignOutButton>
			</MenuPanel>
		</Menu>
	)
}
