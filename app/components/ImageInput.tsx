import { isUrl } from "../helpers/index.ts"
import { panel } from "../styles/panel.ts"

export function ImageInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className={panel("flex flex-col divide-y rounded-md border")}>
			<input
				placeholder="Image URL"
				{...props}
				className="h-10 rounded-t-md bg-transparent px-3 leading-none"
			/>
			<div className="aspect-square">
				{typeof props.value === "string" && isUrl(props.value) && (
					<a href={props.value} target="_blank" rel="noopener noreferrer">
						<img
							key={props.value}
							src={props.value}
							alt=""
							className="aspect-square object-contain"
						/>
					</a>
				)}
			</div>
		</div>
	)
}
