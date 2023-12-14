import { autoRef } from "~/helpers/autoRef.tsx"

export interface ExternalLinkProps extends React.ComponentPropsWithRef<"a"> {
	href: string
}

export const ExternalLink = autoRef(function ExternalLink(
	props: ExternalLinkProps,
) {
	return <a target="_blank" rel="noopener noreferrer" {...props} />
})
