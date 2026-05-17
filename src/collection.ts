import { type ManagedCollection, type ManagedCollectionFieldInput, type ProtectedMethod } from "framer-plugin"

// Stable plugin data keys — never rename these
export const PLUGIN_KEYS = {
    API_URL: "anteApiUrl",
    BUTTON_LABEL: "anteButtonLabel",
    SUCCESS_MESSAGE: "anteSuccessMessage",
    SHOW_FIRST_NAME: "anteShowFirstName",
    SHOW_LAST_NAME: "anteShowLastName",
} as const

// Stable field IDs — never rename these either
// Renaming breaks any canvas bindings the designer has set up
export const FIELD_IDS = {
    EMAIL: "ante-email",
    FIRST_NAME: "ante-first-name",
    LAST_NAME: "ante-last-name",
    SUBMITTED_AT: "ante-submitted-at",
} as const

export interface AnteConfig {
    apiUrl: string
    buttonLabel: string
    successMessage: string
    showFirstName: boolean
    showLastName: boolean
}

export const syncMethods = [
    "ManagedCollection.setFields",
    "ManagedCollection.setPluginData",
] as const satisfies ProtectedMethod[]

export async function setupCollection(collection: ManagedCollection, config: AnteConfig): Promise<void> {
    const fields: ManagedCollectionFieldInput[] = [
        {
            id: FIELD_IDS.EMAIL,
            name: "Email",
            type: "string",
        },
        {
            id: FIELD_IDS.SUBMITTED_AT,
            name: "Submitted At",
            type: "date",
        },
    ]

    if (config.showFirstName) {
        fields.push({
            id: FIELD_IDS.FIRST_NAME,
            name: "First Name",
            type: "string",
        })
    }

    if (config.showLastName) {
        fields.push({
            id: FIELD_IDS.LAST_NAME,
            name: "Last Name",
            type: "string",
        })
    }

    await collection.setFields(fields)

    // Persist config so reopening the plugin restores previous values
    await collection.setPluginData(PLUGIN_KEYS.API_URL, config.apiUrl)
    await collection.setPluginData(PLUGIN_KEYS.BUTTON_LABEL, config.buttonLabel)
    await collection.setPluginData(PLUGIN_KEYS.SUCCESS_MESSAGE, config.successMessage)
    await collection.setPluginData(PLUGIN_KEYS.SHOW_FIRST_NAME, String(config.showFirstName))
    await collection.setPluginData(PLUGIN_KEYS.SHOW_LAST_NAME, String(config.showLastName))
}
