import { framer } from "framer-plugin"
import type { AnteConfig } from "./collection"

// The published Framer code component URL
// Remove the @saveId suffix so the plugin always inserts the latest version
const COMPONENT_URL = "https://framer.com/m/ante/WaitlistForm.js"

export async function injectForm(config: AnteConfig): Promise<void> {
    // Read the project's existing color and text styles
    // so the inserted form inherits the designer's palette
    const colorStyles = await framer.getColorStyles()
    const textStyles = await framer.getTextStyles()

    // Try to find sensible matches — fall back to neutral defaults
    const primaryColor = colorStyles.find(s => /primary|accent|brand/i.test(s.name))?.light ?? "rgba(0,0,0,1)"

    const backgroundColor =
        colorStyles.find(s => /background|bg|surface|base/i.test(s.name))?.light ?? "rgba(255,255,255,1)"

    const bodyStyle = textStyles.find(s => /body|paragraph|base|text/i.test(s.name))

    await framer.addComponentInstance({
        url: COMPONENT_URL,
        attributes: {
            width: "600px",
            height: "fit-content",

            controls: {
                // Form behaviour
                showFirstName: config.showFirstName,
                showLastName: config.showLastName,
                buttonLabel: config.buttonLabel,
                successMessage: config.successMessage,
                apiUrl: config.apiUrl,

                // Design tokens pulled from the project
                primaryColor,
                backgroundColor,
                fontSize: bodyStyle?.fontSize ?? 16,
                fontFamily: bodyStyle?.font?.family ?? "Inter, sans-serif",
                borderRadius: "8px",
                gap: "12px",
            },
        },
    })
}
