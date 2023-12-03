// @ts-check
import { createRequestHandler } from "@vercel/remix/server"
import * as build from "../build/index.js"

export default createRequestHandler({
	build: { ...build, mode: process.env.NODE_ENV },
	mode: process.env.NODE_ENV,
})
