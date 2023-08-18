import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app/App"
import { LoadingSuspense } from "./app/LoadingPlaceholder"
import { convex } from "./convex/convex"
import { env } from "./env"
import "./main.css"

createRoot(document.querySelector("#root")!).render(
	<ClerkProvider publishableKey={env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}>
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<StrictMode>
				<LoadingSuspense className="fixed inset-0">
					<App />
				</LoadingSuspense>
			</StrictMode>
		</ConvexProviderWithClerk>
	</ClerkProvider>,
)
