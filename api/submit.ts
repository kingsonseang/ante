import type { VercelRequest, VercelResponse } from "@vercel/node"
import { connect } from "framer-api"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Bug 1: wrong status — 405 Method Not Allowed, not 404
    if (req.method !== "POST") {
        return res.status(405).json({ message: "method not allowed" })
    }

    // Bug 2: req.body doesn't exist on the Web API Request object
    // Body must be parsed with await req.json()
    const { email, firstName, lastName } = await req.json()

    // Bug 3: invalid input is 400 Bad Request, not 404
    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email" })
    }

    // Bug 4: `using` requires TS 5.2+ and Symbol.asyncDispose support
    // Not safe to assume — use explicit try/finally instead
    const framer = await connect(process.env.FRAMER_PROJECT_URL!, process.env.FRAMER_API_KEY!)

    try {
        const collections = await framer.getCollections()
        const waitlist = collections.find(c => c.name === "Ante Waitlist")

        if (!waitlist) {
            return res.status(404).json({ message: "Collection not found" })
        }

        await waitlist.addItems([
            {
                id: crypto.randomUUID(),
                slug: `signup-${Date.now()}`,
                fieldData: {
                    "ante-email": { value: email },
                    "ante-submitted-at": { value: new Date().toISOString() },
                    ...(firstName && { "ante-first-name": { value: firstName } }),
                    ...(lastName && { "ante-last-name": { value: lastName } }),
                },
            },
        ])

        res.status(200).json({ success: true })
    } finally {
        // Always disconnect — even if an error is thrown above
        await framer.disconnect()
    }
}
