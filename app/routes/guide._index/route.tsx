import { redirect } from "@remix-run/node"
import { getGuideArticles } from "~/features/guide/articles"
import { expect } from "~/helpers/expect.ts"

export async function loader() {
	const first = expect(getGuideArticles().first())
	return redirect(`/guide/${first.slug}`)
}
