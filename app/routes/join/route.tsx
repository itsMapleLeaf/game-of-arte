import { SignInButton } from "@clerk/remix"
import { type LoaderFunctionArgs, redirect } from "@remix-run/node"
import { Link, useLoaderData, useNavigate } from "@remix-run/react"
import { api } from "convex/_generated/api.js"
import type { Id } from "convex/_generated/dataModel.js"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { LucideHome, LucideLogIn, LucideSparkles } from "lucide-react"
import { Button } from "~/components/Button.tsx"
import { LoadingPlaceholder } from "~/components/LoadingPlaceholder.tsx"
import { useAsyncCallback } from "~/helpers/useAsyncCallback.ts"

export async function loader({ request }: LoaderFunctionArgs) {
	const inviteId = new URL(request.url).searchParams.get("invite")
	return inviteId ? { inviteId: inviteId as Id<"invites"> } : redirect("/")
}

export default function JoinPage() {
	const { inviteId } = useLoaderData<typeof loader>()
	const { isLoading, isAuthenticated } = useConvexAuth()
	const invite = useQuery(api.invites.get, { id: inviteId })
	const acceptMutation = useMutation(api.invites.accept)
	const navigate = useNavigate()

	const [accept, acceptState] = useAsyncCallback(async () => {
		await acceptMutation({ id: inviteId })
		navigate("/")
	})

	if (invite === undefined) {
		return <LoadingPlaceholder />
	}

	if (invite === null) {
		return (
			<main className="flex h-[calc(100dvh-16rem)] flex-col items-center justify-center gap-4 p-8 text-center">
				<p className="text-2xl font-light" data-testid="invalidInviteMessage">
					Sorry, it doesn't look like this invite is valid.
				</p>
				<Button icon={LucideHome} size="large" asChild>
					<Link to="/">Go home</Link>
				</Button>
			</main>
		)
	}

	return (
		<main className="flex h-[calc(100dvh-16rem)] flex-col items-center justify-center gap-4 p-8 text-center">
			<h1 className="text-5xl font-light">Welcome to the Game of Arte.</h1>
			<p className="text-2xl font-light">
				You've been invited to join as a player!
			</p>
			{isLoading ?
				<LoadingPlaceholder />
			: isAuthenticated ?
				<Button
					icon={LucideSparkles}
					size="large"
					onClick={accept}
					pending={acceptState.isLoading}
				>
					Let me in!
				</Button>
			:	<SignInButton>
					<Button icon={LucideLogIn} size="large">
						Sign in to join
					</Button>
				</SignInButton>
			}
		</main>
	)
}
