import "@fontsource-variable/rubik"
import "tailwindcss/tailwind.css"

import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./components/App.tsx"
import { AppTitle } from "./components/AppTitle.tsx"
import { AssignedCharacterRedirect } from "./components/AssignedCharacterRedirect.tsx"
import { AuthGuard } from "./components/AuthGuard.tsx"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
import { parseNonNil } from "./helpers/errors.ts"

const convex = new ConvexReactClient(import.meta.env.VITE_PUBLIC_CONVEX_URL)

createRoot(parseNonNil(document.querySelector("#root"))).render(
	<ClerkProvider
		publishableKey={import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}
	>
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<StrictMode>
				<AuthGuard>
					<AppTitle />
					<AssignedCharacterRedirect />
					<LoadingSuspense className="fixed inset-0">
						<App />
					</LoadingSuspense>
				</AuthGuard>
			</StrictMode>
		</ConvexProviderWithClerk>
	</ClerkProvider>,
)
