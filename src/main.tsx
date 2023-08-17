import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./components/App"
import "./main.css"

createRoot(document.querySelector("#root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
