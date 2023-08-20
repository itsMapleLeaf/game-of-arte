import "tailwindcss/tailwind.css"

import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./components/App"
import { Identify } from "./components/Identify.tsx"
import { LoadingSuspense } from "./components/LoadingPlaceholder"

const convex = new ConvexReactClient(import.meta.env.VITE_PUBLIC_CONVEX_URL)

createRoot(document.querySelector("#root")!).render(
	<ClerkProvider
		publishableKey={import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}
	>
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<StrictMode>
				<LoadingSuspense className="fixed inset-0">
					<App />
					<Identify />
				</LoadingSuspense>
			</StrictMode>
		</ConvexProviderWithClerk>
	</ClerkProvider>,
)
