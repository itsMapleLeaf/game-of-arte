import { redirect } from "@remix-run/node"
import { guideDocuments } from "~/features/guide/data.ts"
import { expect } from "~/helpers/expect.ts"

export async function loader() {
	const firstDocumentId = expect(Object.keys(guideDocuments)[0])
	return redirect(`/guide/${firstDocumentId}`)
}
