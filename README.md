# localCV

LocalCV is an open source, local-first AI resume maker and cover letter generator built for people who want a faster way to create ATS-ready resumes without giving up control of their data.

Live app: https://localcv.tusharvashishth.com

If localCV helps you, star the repo. It makes the project easier to discover and helps the open source work continue.

## Why localCV

Most resume builders push users into signups, paid exports, or generic templates.

localCV takes a different approach:

- Build resumes completely free
- No signup or credit card required
- Store resume data locally on your device
- Bring your own AI provider for rewriting and ATS refinement
- Start from polished templates that are already designed for clarity and compatibility

## What You Can Do

- Build and manage resume content with a local-first workflow
- Refine bullet points with AI-assisted rewriting
- Tailor your resume for ATS screening and job descriptions
- Choose from 8 resume templates: Classic, Modern, Minimal, Executive, Technical, Sidebar Color, With Photo, and Creative
- Preview changes instantly before export
- Generate job-specific resume variants with minimal effort
- Generate tailored cover letters for any job by pasting the job description
- Choose from 4 cover letter templates: Clean, Professional, Bold, and Elegant
- Customise cover letter font, size, accent colour, and export as PDF
- Parse existing CV content to speed up profile creation

## Quick Start

### Prerequisites

- Node.js >= 24
- npm

### Install and Run

```bash
npm install
```

Open http://localhost:3000 in your browser.

### Optional Environment Variables

AI features use a bring-your-own API key flow. To enable local AI key encryption and verification in development, create a `.env.local` file:

```bash
ENCRYPTION_KEY=replace-with-a-strong-secret
ENCRYPTION_SALT=replace-with-a-unique-salt
```

These values are required for saving and decrypting user-provided AI API keys. Core resume building and template browsing can still be developed independently from that flow.

## Available Scripts

| Command            | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Starts the Next.js development server           |
| `npm run build`    | Creates a production build                      |
| `npm run start`    | Starts the production server                    |
| `npm run lint`     | Runs ESLint                                     |
| `npm run cy:open`  | Opens the Cypress app                           |
| `npm run cy:run`   | Runs Cypress in headless mode                   |
| `npm run test:e2e` | Starts the app and runs the full E2E test suite |

## Product Flow

1. Add your profile, experience, projects, and skills.
2. Pick a resume template that matches the role you are targeting.
3. Connect your AI provider and improve summaries or bullet points.
4. Export a cleaner, role-specific resume in minutes.
5. Generate a tailored cover letter for the same role — paste the job description and let the AI write a first draft based on your profile.

## Core Features

### Local-first by default

Resume content is stored locally with IndexedDB so users can work on their resume without creating an account.

### ATS-focused writing experience

localCV is built around resume clarity, keyword alignment, and structured content that works better with applicant tracking systems.

### AI where it is useful

Instead of trying to replace the user, localCV uses AI to improve raw experience into stronger, impact-driven content. The project supports a bring-your-own provider and model flow so users stay in control.

### Ready-to-use templates

The template gallery includes traditional, modern, executive, technical, and creative layouts so users can tailor their resume to different industries and roles.

### Cover letter generation

From any job-specific resume variant, users can generate an AI-written cover letter tailored to the target company and job description. The cover letter builder offers 4 templates (Clean, Professional, Bold, Elegant) with full style control — font family, size, accent colour, and text colour — and exports to PDF. All content is derived from the user's profile and never stored externally.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Dexie and IndexedDB
- Mastra SDK
- Shadcn UI
- Zod
- Cypress

## Project Structure

```text
src/
	app/                 App Router pages and API routes
	components/
		features/          Builder, dashboard, landing, profile, and templates
		shared/            Shared app components
		ui/                Reusable UI primitives
	lib/                 Utilities, DB schema, encryption, parsing helpers
	mastra/              Agents, tools, and workflows
cypress/               End-to-end tests
public/                Static assets and brand logos
```

## Testing

Run the full end-to-end suite:

```bash
nvm use 24.11.1
npm run test:e2e
```

Open Cypress interactively:

```bash
nvm use 24.11.1
npm run cy:open
```

## Contributing

Contributions are welcome.

Please read the full contribution guide in `CONTRIBUTING.md` before opening a pull request. It includes setup, standards, testing expectations, and PR checklist.

Quick contributor checklist:

1. Use the right Node version: `nvm use 24.11.1`
2. Run lint and tests: `npm run lint` and `npm run test:e2e`
3. Keep changes focused and aligned with project conventions
4. Open a PR and ensure all CI checks pass

Issues, fixes, UX improvements, and documentation improvements are all useful contributions.

## Maintainer

localCV is owned and maintained by Tushar Vashishth.

Production deployment: https://localcv.tusharvashishth.com

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
