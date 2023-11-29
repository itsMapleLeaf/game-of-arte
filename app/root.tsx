import "@fontsource-variable/rubik"
import "tailwindcss/tailwind.css"

import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import {
	Links,
	LiveReload,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
} from "@remix-run/react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import faviconUrl from "./assets/favicon.svg"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
import { TooltipProvider } from "./components/Tooltip.tsx"
import { env } from "./env.ts"
import { AuthGuard } from "./features/auth/AuthGuard.tsx"

const convex = new ConvexReactClient(env.VITE_PUBLIC_CONVEX_URL)

export const meta: MetaFunction = () => [
	{ title: "Game of Arte" },
	{ rel: "icon", href: faviconUrl },
]

export default function Root() {
	return (
		<html
			lang="en"
			className="break-words bg-base-950 text-base-100 [&_*::-webkit-scrollbar-thumb]:bg-base-700 [&_*::-webkit-scrollbar-track]:bg-base-900 [&_*::-webkit-scrollbar]:w-2"
		>
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<Meta />
				<Links />
			</head>
			<body>
				<ClerkProvider publishableKey={env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}>
					<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
						<TooltipProvider delayDuration={250}>
							<AuthGuard>
								<LoadingSuspense className="fixed inset-0">
									<Outlet />
								</LoadingSuspense>
							</AuthGuard>
						</TooltipProvider>
					</ConvexProviderWithClerk>
				</ClerkProvider>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
