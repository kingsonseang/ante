# Ante — Waitlist Plugin for Framer

> Collect emails on any Framer site. Zero backend required to get started.

Ante is a Framer plugin that drops a fully configurable waitlist form onto your canvas in seconds. Submissions are saved directly to Framer CMS. When you're ready to grow, connect your own API and sync to Notion, Airtable, or anywhere else.

---

## Getting started

### Prerequisites

- Node 18+
- A Framer account with at least one project
- (For live submissions) A Vercel account for the API relay

### Install and run

```bash
npm install
npm run dev
```

Then open Framer, go to **Plugins → Developer Tools → Open Development Plugin**.

Other package managers:

```bash
yarn dev
pnpm dev
bun dev
```

Docs: [Opening your plugin in Framer](https://www.framer.com/developers/plugins/quick-start#opening-in-framer)

---

## How it works

Ante has two parts:

**1. The plugin (this repo)**
Opens inside the Framer editor. Lets you configure field toggles, button copy, and success messaging. On insert, it reads your project's color and text styles, creates a Managed CMS Collection called `Ante Waitlist`, and drops the form component onto the canvas pre-styled to match your design system.

**2. The API relay (`/api/submit.ts`)**
A single Vercel serverless function. Receives form submissions from the live published site and writes them to your Framer CMS collection via the Framer Server API. Deploy once, paste the URL into the plugin panel.

```
User submits form on live site
  → POST /api/submit
    → framer-api writes entry to CMS
      → Entry appears in Framer CMS
```

---

## Project structure

```
ante/
├── plugin/
│   ├── src/
│   │   ├── main.tsx          # Entry point, calls framer.showUI()
│   │   ├── App.tsx           # Config panel UI
│   │   ├── collection.ts     # CMS Managed Collection setup
│   │   └── inject.ts         # Reads project styles, inserts component
│   └── framer.json           # Plugin manifest
│
├── component/
│   └── WaitlistForm.tsx      # Framer code component (published separately)
│
└── api/
    └── submit.ts             # Vercel serverless function
```

---

## Configuration

### Plugin panel

| Setting | Description | Default |
|---|---|---|
| First name | Toggle to collect first name | Off |
| Last name | Toggle to collect last name | Off |
| Button label | CTA text on the submit button | `Join Waitlist` |
| Success message | Shown after a successful submission | `You're on the list!` |
| API endpoint | Your deployed Vercel function URL | — |

### Environment variables (API relay)

Create a `.env` file in `/api`:

```bash
FRAMER_PROJECT_URL=https://framer.com/projects/your-project-id
FRAMER_API_KEY=your-api-key-from-site-settings
```

Your API key is generated under **Site Settings → General** in Framer. Keep it in `.env` and never commit it.

---

## CMS collection schema

Ante auto-creates a Managed Collection called `Ante Waitlist` with stable field IDs that never change between updates:

| Field | ID | Type | Always present |
|---|---|---|---|
| Email | `ante-email` | string | ✓ |
| Submitted At | `ante-submitted-at` | date | ✓ |
| First Name | `ante-first-name` | string | When toggled on |
| Last Name | `ante-last-name` | string | When toggled on |

---

## Development

### Running the plugin locally

```bash
cd plugin
npm run dev
```

Enable **Developer Tools** in Framer under **Plugins → Developer Tools**, then open your development plugin.

### Running the API locally

```bash
cd api
npx vercel dev
```

Use a tool like [ngrok](https://ngrok.com) to expose your local API for end-to-end testing before deploying.

### Publishing the form component

The `WaitlistForm` component lives in `/component` and is published to Framer separately as a code component. Once published, copy its Module URL (right-click the component in Assets → Copy URL) and update `COMPONENT_URL` in `inject.ts`. Remove the `@saveId` suffix so the plugin always uses the latest version.

### Deploying the API

```bash
cd api
vercel deploy
```

Paste the resulting URL into the plugin panel's API endpoint field.

---

## References

- [Framer Plugin API](https://www.framer.com/developers/plugins-introduction)
- [Framer CMS Plugin Guide](https://www.framer.com/developers/cms)
- [Framer Server API](https://www.framer.com/developers/server-api-introduction)
- [Framer Component Property Controls](https://www.framer.com/developers/property-controls)
- [Framer Plugin Interface](https://www.framer.com/developers/interface)
- [Framer Styles API](https://www.framer.com/developers/styles)

---

## Roadmap

### v1 — Framer CMS (current)
- [x] Plugin config panel (field toggles, button label, success message)
- [x] Auto-creates Managed CMS Collection with stable field IDs
- [x] Reads project color and text styles on insert
- [x] Injects WaitlistForm component pre-styled to match the project
- [x] Vercel API relay writes submissions to Framer CMS
- [x] Dark/light mode support via Framer color tokens
- [x] `framer.notify()` feedback on all actions

### v2 — Auth + API key connection
- [ ] User accounts (email/password or OAuth)
- [ ] API key generation per project
- [ ] Plugin connects to Ante backend instead of Framer CMS directly
- [ ] Submissions dashboard inside the plugin panel
- [ ] Basic deduplication (same email → update timestamp, no duplicate entry)
- [ ] Rate limiting and honeypot spam protection

### v3 — Integrations
- [ ] Notion sync — select database, map fields
- [ ] Airtable sync — select base and table
- [ ] Webhook support — POST to any URL on new submission
- [ ] CSV export from plugin panel
- [ ] Email notification on new signup (via Resend or similar)

### v4 — Multi-platform
- [ ] Webflow plugin
- [ ] Standalone embeddable script (drop into any HTML site)
- [ ] Public waitlist page (`ante.so/w/your-project`)
- [ ] Referral / position tracking ("You're #47 on the list")

### v5 — Growth layer
- [ ] Waitlist analytics (signups over time, source tracking)
- [ ] Invite-based early access (grant access to N users at a time)
- [ ] Custom confirmation email with logo and messaging
- [ ] Zapier / Make integration
