### Project Overview

- localCV: a local-first, privacy-focused AI Resume Maker built using Next.js.Here user can build resume , change resume based on ATS with AI.

### NPM installation

- Before any npm command use `nvm use 24.11.1` to ensure you are using the correct Node version.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- IndexDB with dexie
- AI SDK
- Shadcn UI

## Code Style

- Use camelCase for variable and function names.
- Use PascalCase for component names.
- Use kebab-case for file names.

### Project Structure

- `src/`: Contains all source code for the application.
  - `components/`: Reusable UI components.
    - `ui/`: Shadcn UI components.
    - `common/`: Common components used across the app.
    - `features/`: Feature-specific components and logic.
      - `components/`: React components for the feature.
      - `hooks/`: Custom hooks for the feature.
      - `types/`: TypeScript types for the feature.
      - `schema/`: Zod schemas for validating data related to the feature.
    - `templates/`: Predefined resume templates.
  - `app/`: Next.js pages.
  - `lib/`: Utility functions and libraries.
  - `globals.css`: Global styles using Tailwind CSS.
  - `app/api/`: API routes for server-side logic.

### Code Best Practices

- Never convert any server page to client page. Always create a new client component and use it in server page.
- Always use zod for validating data in API routes and components.
- Always use try-catch block in API routes and handle errors gracefully.and use toast for showing error messages to users.
- Always keep the components small and reusable.
- use one liner comment when necessary like this **\*\*** COMMENT **\*\***
- for any server side code create api route and call it from client component. never write server side code in client component.
