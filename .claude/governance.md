# Governance — sereno-app
# Inferred by crag analyze — review and adjust as needed

## Identity
- Project: sereno-app
- Stack: node, react, typescript

## Gates (run in order, stop on failure)
### Lint
- npm run lint
- npx tsc --noEmit

### Test
- npm run test

### Build
- npm run build

### CI (inferred from workflow)
- npm run lint:prettier

## Advisories (informational, not enforced)
- actionlint  # [ADVISORY]

## Branch Strategy
- Trunk-based development
- Free-form commits
- Commit trailer: Co-Authored-By: Claude <noreply@anthropic.com>

## Security
- No hardcoded secrets — grep for sk_live, AKIA, password= before commit

## Autonomy
- Auto-commit after gates pass

## Deployment
- Target: vercel
- CI: github-actions

## Architecture
- Type: monolith

## Key Directories
- `.github/` — CI/CD
- `public/` — static assets
- `src/` — source

## Testing
- Framework: vitest
- Layout: flat

## Code Style
- Indent: 2 spaces
- Formatter: prettier
- Linter: eslint

## Dependencies
- Package manager: npm (package-lock.json)

## Import Conventions
- Module system: ESM
- Path aliases: @/

## Anti-Patterns

Do not:
- Do not leave `console.log` in production code — use a proper logger
- Do not use synchronous filesystem APIs in request handlers
- Do not use class components — use functional components with hooks
- Do not mutate state directly — use setter functions or immutable updates
- Do not use `any` type — use `unknown` or proper types instead
- Do not use `@ts-ignore` — fix the type error or use `@ts-expect-error` with a reason
- Prefer `as const` over `enum` for string unions

## Framework Conventions
- React 18.3.1
- Use functional components with hooks — no class components
- Use React Router for client-side routing

