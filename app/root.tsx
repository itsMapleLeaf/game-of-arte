import "@fontsource-variable/rubik"
import "tailwindcss/tailwind.css"

import { ClerkApp, ClerkErrorBoundary, useAuth } from "@clerk/remix"
import { rootAuthLoader } from "@clerk/remix/ssr.server"
import type { LoaderFunctionArgs } from "@remix-run/node"
import {
	Links,
	LiveReload,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
} from "@remix-run/react"
import type { LinksFunction } from "@remix-run/react/dist/routeModules"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import faviconUrl from "./assets/favicon.svg"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
import { TooltipProvider } from "./components/Tooltip.tsx"
import { env } from "./env.ts"

const convex = new ConvexReactClient(env.VITE_PUBLIC_CONVEX_URL)

export const meta: MetaFunction = () => [
	{ title: "Game of Arte" },
	{ charSet: "utf-8" },
	{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
]

export const links: LinksFunction = () => [{ rel: "icon", href: faviconUrl }]

export function loader(args: LoaderFunctionArgs) {
	return rootAuthLoader(args)
}

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className="break-words bg-base-950 text-base-100 [&_*::-webkit-scrollbar-thumb]:bg-base-700 [&_*::-webkit-scrollbar-track]:bg-base-900 [&_*::-webkit-scrollbar]:w-2"
		>
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<TooltipProvider delayDuration={250}>
					<LoadingSuspense className="fixed inset-0">
						{children}
					</LoadingSuspense>
				</TooltipProvider>
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}

export default ClerkApp(function Root() {
	return (
		<Document>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<Outlet />
			</ConvexProviderWithClerk>
		</Document>
	)
})

export const ErrorBoundary = ClerkErrorBoundary()
