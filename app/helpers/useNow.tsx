import { useEffect, useState } from "react"

export function useNow(updateInterval = 1000) {
	const [now, setNow] = useState(() => Date.now())
	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), updateInterval)
		return () => clearInterval(interval)
	}, [updateInterval])
	return now
}
