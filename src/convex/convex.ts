import { ConvexReactClient } from "convex/react"
import { env } from "../env"

export const convex = new ConvexReactClient(env.VITE_PUBLIC_CONVEX_URL)
