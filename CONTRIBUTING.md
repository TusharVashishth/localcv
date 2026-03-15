# Contributing to localCV

Thanks for contributing to localCV.

This guide explains how to set up your environment, follow project standards, and open pull requests that are easy to review and merge.

## Project Principles

- Local-first: user data is stored locally using IndexedDB.
- Privacy-focused: avoid collecting user data unnecessarily.
- Contributor-friendly: keep changes focused, readable, and testable.

## Prerequisites

- Node.js >= 24.11
- npm

## Local Setup

```bash
git clone https://github.com/tusharvashishth/local_cv.git
cd local_cv
npm install
npm run dev
```

Open http://localhost:3000.

## Optional Environment Variables

For API key encryption flows in development, create `.env.local`:

```bash
ENCRYPTION_KEY=replace-with-a-strong-secret
ENCRYPTION_SALT=replace-with-a-unique-salt
```

Core resume features work without these values.

## Branch Strategy

- Create one branch per feature/fix/docs change.
- Keep PRs small and scoped.
- Use clear branch names:

```bash
feature/add-template-filter
fix/profile-save-validation
docs/update-contributing-guide
```

## Coding Standards

Follow repository conventions from `Agents.md`.

- Use camelCase for variables and functions.
- Use PascalCase for React component names.
- Use kebab-case for file names.
- Keep components small and reusable.
- Never move server-side code into client components.

### Server and Client Boundaries

- Do not convert server pages to client pages unless absolutely required.
- For server logic, create API routes under `src/app/api`.
- Call API routes from client components when needed.

### Validation and Error Handling

- Use Zod schemas for request/form validation.
- In API routes, always use try-catch.
- Return clear error responses and show client-side feedback (toast where applicable).

## Testing and Quality Checks

Run these checks before opening a PR:

```bash
npm run lint
npm run build
npm run test:e2e
```

Cypress tests are in `cypress/e2e`.

## Pull Request Process

1. Sync with latest main branch.
2. Make focused commits with clear commit messages.
3. Run lint, build, and test commands.
4. Open a pull request with a clear description.
5. Address review feedback with follow-up commits.

## PR Checklist

Copy this into your pull request description:

```markdown
## Summary

- What changed and why

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation

## Validation

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run test:e2e`

## Screenshots / Recordings

- Added for UI changes (if applicable)

## Notes

- Risks, follow-ups, or limitations
```

## CI on Pull Requests

Every pull request runs automated checks using GitHub Actions:

- Lint
- Build
- End-to-end tests

A PR is considered technically ready for review when all CI checks are green.

## Reporting Issues and Ideas

- Open a GitHub Issue for bugs and feature requests.
- Include reproducible steps for bugs.
- Share expected vs actual behavior and screenshots when possible.

## License

By contributing, you agree your contributions are licensed under the MIT License.
