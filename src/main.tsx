import { ClerkProvider, useAuth } from "@clerk/clerk-react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app/App"
import { env } from "./env"
import "./main.css"

const convex = new ConvexReactClient(env.VITE_PUBLIC_CONVEX_URL)

createRoot(document.querySelector("#root")!).render(
	<ClerkProvider publishableKey={env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY}>
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			<StrictMode>
				<App />
			</StrictMode>
		</ConvexProviderWithClerk>
	</ClerkProvider>,
)
