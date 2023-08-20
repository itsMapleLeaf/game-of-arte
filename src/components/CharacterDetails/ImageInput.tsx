import { isUrl } from "../../helpers/index.ts"
import { panel } from "../../styles/panel.ts"

export function ImageInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className={panel("flex flex-col divide-y rounded-md border")}>
			<input
				placeholder="Image URL"
				{...props}
				className="h-10 rounded-t-md bg-transparent px-3 leading-none"
			/>
			<div className="group relative aspect-square">
				{typeof props.value === "string" && isUrl(props.value) && (
					<a
						href={props.value}
						target="_blank"
						rel="noopener noreferrer"
						className="absolute inset-0 overflow-clip rounded-b-md"
					>
						<img
							src={props.value}
							alt=""
							className="absolute inset-0 object-cover transition s-full group-hover:brightness-50 group-focus:brightness-50"
						/>
						<img
							src={props.value}
							alt=""
							className="absolute inset-0 object-contain opacity-0 transition s-full group-hover:opacity-100 group-focus:opacity-100"
						/>
					</a>
				)}
			</div>
		</div>
	)
}
