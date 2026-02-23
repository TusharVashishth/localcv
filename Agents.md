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
- use one liner comment when necessary like this **\*\*** COMMENT **\*\***
- for each new model create new folder in features and add all the files related to that model in that folder.

### Project Structure

- `src/`: Contains all source code for the application.
  - `components/`: Reusable UI components.
    - `ui/`: Shadcn UI components.
    - `common/`: Common components used across the app.
    - `features/`: Feature-specific components and logic.
  - `app/`: Next.js pages.
  - `lib/`: Utility functions and libraries.
  - `globals.css`: Global styles using Tailwind CSS.
  - `app/api/`: API routes for server-side logic.
