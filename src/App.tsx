import "./App.css"

import { framer, type ManagedCollection, useIsAllowedTo } from "framer-plugin"
import { useLayoutEffect } from "react"
import { useForm } from "react-hook-form"
import { type AnteConfig, setupCollection, syncMethods } from "./collection"
import { injectForm } from "./inject"

interface AppProps {
    collection: ManagedCollection
    previousConfig: AnteConfig
}

export function App({ collection, previousConfig }: AppProps) {
    const isAllowedToManage = useIsAllowedTo(...syncMethods)

    const {
        register,
        handleSubmit,
        watch: _watch,
        formState: { isSubmitting },
    } = useForm<AnteConfig>({
        defaultValues: previousConfig,
    })

    // Keep the plugin panel a fixed size — no data source step needed
    useLayoutEffect(() => {
        framer.showUI({
            width: 260,
            height: 440,
            resizable: false,
        })
    }, [])

    const onSubmit = async (data: AnteConfig) => {
        if (!data.apiUrl) {
            framer.notify("Please enter your API endpoint URL before inserting.", {
                variant: "warning",
            })
            return
        }

        try {
            await setupCollection(collection, data)
            await injectForm(data)
            framer.closePlugin("Ante waitlist form inserted!", { variant: "success" })
        } catch (error) {
            console.error(error)
            framer.notify("Something went wrong. Check the console for details.", {
                variant: "error",
            })
        }
    }

    return (
        <main>
            {/* Header */}
            <div className="intro" style={{ height: "auto", textAlign: "left", maxWidth: "100%" }}>
                <div className="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <title>Ante</title>
                        <circle cx="15" cy="15" r="6" fill="currentColor" />
                    </svg>
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Ante</h2>
                    <p style={{ margin: 0 }}>Waitlist form for Framer</p>
                </div>
            </div>

            <hr />

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Fields section */}
                <span className="section-title">Collect</span>

                <label className="setup" style={{ flexDirection: "column", height: "auto", gap: 6 }}>
                    <div className="toggle-row">
                        First name
                        <input type="checkbox" {...register("showFirstName")} disabled={!isAllowedToManage} />
                    </div>
                    <div className="toggle-row">
                        Last name
                        <input type="checkbox" {...register("showLastName")} disabled={!isAllowedToManage} />
                    </div>
                </label>

                <hr />

                {/* Copy section */}
                <span className="section-title">Copy</span>

                <div className="field-group">
                    <label htmlFor="buttonLabel">Button label</label>
                    <input
                        id="buttonLabel"
                        type="text"
                        placeholder="Join Waitlist"
                        disabled={!isAllowedToManage}
                        {...register("buttonLabel")}
                    />
                </div>

                <div className="field-group">
                    <label htmlFor="successMessage">Success message</label>
                    <input
                        id="successMessage"
                        type="text"
                        placeholder="You're on the list!"
                        disabled={!isAllowedToManage}
                        {...register("successMessage")}
                    />
                </div>

                <hr />

                {/* API section */}
                <span className="section-title">Endpoint</span>

                <div className="field-group">
                    <label htmlFor="apiUrl">API URL</label>
                    <input
                        id="apiUrl"
                        type="text"
                        placeholder="https://your-app.vercel.app/api/submit"
                        disabled={!isAllowedToManage}
                        {...register("apiUrl")}
                    />
                </div>

                <footer>
                    <hr />
                    <button
                        type="submit"
                        className="framer-button-primary"
                        disabled={isSubmitting || !isAllowedToManage}
                        title={!isAllowedToManage ? "Insufficient permissions" : undefined}
                    >
                        {isSubmitting ? <div className="framer-spinner" /> : "Insert Waitlist Form"}
                    </button>
                </footer>
            </form>
        </main>
    )
}
