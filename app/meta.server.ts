import type { MetaDescriptor } from "@remix-run/react"
import { fromMetaData } from "@remix-run/v1-meta"
import { type SeoConfig, initSeo } from "remix-seo"

const seo = initSeo({
	title: "Game of Arte",
	titleTemplate: "%s | Game of Arte",
	description: "A virtual tabletop for the Game of Arte",
	robots: {
		noIndex: true,
		noFollow: true,
	},
})

export function getMeta(config?: SeoConfig): MetaDescriptor[] {
	return fromMetaData(seo.getSeoMeta(config))
}
