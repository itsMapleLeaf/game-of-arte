import { redirect } from "@remix-run/node"
import faviconUrl from "~/assets/favicon.svg"

export function loader() {
	return redirect(faviconUrl)
}
