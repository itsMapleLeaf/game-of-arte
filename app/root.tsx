import "@fontsource-variable/rubik"
import "tailwindcss/tailwind.css"

import { ClerkApp, ClerkErrorBoundary, useAuth, useUser } from "@clerk/remix"
import { rootAuthLoader } from "@clerk/remix/ssr.server"
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node"
import {
	Links,
	LiveReload,
	Meta,
	type MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	type ShouldRevalidateFunction,
} from "@remix-run/react"
import { SpeedInsights } from "@vercel/speed-insights/remix"
import { ConvexReactClient, useConvexAuth } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { LucideBook, LucideBookOpenText, LucideGamepad2 } from "lucide-react"
import { useState } from "react"
import faviconUrl from "./assets/favicon.svg"
import { env } from "./env.ts"
import { AuthButton } from "./features/auth/AuthButton.tsx"
import { getMeta } from "./meta.ts"
import { LoadingPlaceholder } from "./ui/LoadingPlaceholder.tsx"
import { NavLinkButton } from "./ui/NavLinkButton.tsx"
import { TooltipProvider } from "./ui/Tooltip.tsx"
import { container } from "./ui/styles.ts"
import { twMerge } from "./ui/twMerge.ts"

export const meta: MetaFunction = () => getMeta()

export const links: LinksFunction = () => [{ rel: "icon", href: faviconUrl }]

export function loader(args: LoaderFunctionArgs) {
	return rootAuthLoader(args)
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

function Document({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className="overflow-x-hidden break-words bg-base-950 text-base-100 [scrollbar-gutter:stable] [&_*::-webkit-scrollbar-thumb]:bg-base-700 [&_*::-webkit-scrollbar-track]:bg-base-900 [&_*::-webkit-scrollbar]:w-2"
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#75cc9e" />
				<Meta />
				<Links />
			</head>
			{/* counteract the scrollbar hiding logic in radix */}
			{/* https://github.com/radix-ui/primitives/issues/1925 */}
			<body className="!mr-0 ![overflow:unset]">
				<TooltipProvider delayDuration={250}>{children}</TooltipProvider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				{process.env.NODE_ENV === "production" && <SpeedInsights />}
			</body>
		</html>
	)
}

export default ClerkApp(function Root() {
	const [convexClient] = useState(
		() => new ConvexReactClient(env.VITE_PUBLIC_CONVEX_URL),
	)
	return (
		<Document>
			<ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
				<AuthLoadingCover>
					<Layout>
						<Outlet />
					</Layout>
				</AuthLoadingCover>
			</ConvexProviderWithClerk>
		</Document>
	)
})

export const ErrorBoundary = ClerkErrorBoundary()

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="isolate flex min-h-[100dvh] flex-col">
			<header className="sticky top-0 z-10 flex h-20 bg-base-950/50 shadow-md shadow-base-950/50 backdrop-blur-md">
				<div className={container("flex items-center")}>
					<div className="flex flex-1 items-center">
						<NavLinkButton
							to="/"
							appearance="clear"
							icon={LucideGamepad2}
							prefetch="render"
						>
							Session
						</NavLinkButton>
						<NavLinkButton
							to="/rules"
							appearance="clear"
							icon={LucideBook}
							prefetch="render"
						>
							Rulebook
						</NavLinkButton>
						<NavLinkButton
							to="/spellbook"
							appearance="clear"
							icon={LucideBookOpenText}
							prefetch="render"
						>
							Spellbook
						</NavLinkButton>
					</div>
					<div className="flex flex-1 items-center justify-end">
						<AuthButton />
					</div>
				</div>
			</header>
			{children}
		</div>
	)
}

function AuthLoadingCover({ children }: { children: React.ReactNode }) {
	const clerkAuth = useUser()
	const convexAuth = useConvexAuth()
	const authLoading = !clerkAuth.isLoaded || convexAuth.isLoading
	return (
		<>
			{children}
			<LoadingPlaceholder
				className={twMerge(
					"fixed inset-0 bg-base-950 transition-all duration-300",
					authLoading ? "visible opacity-100" : "invisible opacity-0",
				)}
			>
				Just a moment...
			</LoadingPlaceholder>
		</>
	)
}
