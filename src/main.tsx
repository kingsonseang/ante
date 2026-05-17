import "framer-plugin/framer.css"

import { framer } from "framer-plugin"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App.tsx"
import { PLUGIN_KEYS } from "./collection"

// Get the active managed collection (same as init)
const activeCollection = await framer.getActiveManagedCollection()

// Read previously saved Ante config from pluginData
const previousApiUrl = await activeCollection.getPluginData(PLUGIN_KEYS.API_URL)
const previousButtonLabel = await activeCollection.getPluginData(PLUGIN_KEYS.BUTTON_LABEL)
const previousSuccessMsg = await activeCollection.getPluginData(PLUGIN_KEYS.SUCCESS_MESSAGE)
const previousFirstName = await activeCollection.getPluginData(PLUGIN_KEYS.SHOW_FIRST_NAME)
const previousLastName = await activeCollection.getPluginData(PLUGIN_KEYS.SHOW_LAST_NAME)

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

createRoot(root).render(
    <StrictMode>
        <App
            collection={activeCollection}
            previousConfig={{
                apiUrl: previousApiUrl ?? "",
                buttonLabel: previousButtonLabel ?? "Join Waitlist",
                successMessage: previousSuccessMsg ?? "You're on the list!",
                showFirstName: previousFirstName === "true",
                showLastName: previousLastName === "true",
            }}
        />
    </StrictMode>
)
