import "@fontsource-variable/rubik"
import "tailwindcss/tailwind.css"

import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App.tsx"
import { AppTitle } from "./AppTitle.tsx"
import { LoadingSuspense } from "./components/LoadingPlaceholder.tsx"
import { env } from "./env.ts"
import { AuthGuard } from "./features/auth/AuthGuard.tsx"
import { expectNonNil } from "./helpers/errors.ts"

const convex = new ConvexReactClient(env.CONVEX_URL)

createRoot(expectNonNil(document.querySelector("#root"))).render(
	<ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY}>
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<StrictMode>
				<AuthGuard>
					<AppTitle />
					<LoadingSuspense className="fixed inset-0">
						<App />
					</LoadingSuspense>
				</AuthGuard>
			</StrictMode>
		</ConvexProviderWithClerk>
	</ClerkProvider>,
)
