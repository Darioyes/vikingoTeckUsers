# VikingoTech - Agent Guide

## Dev Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (http://localhost:4200) |
| `npm run build` | Production build to `dist/` |
| `npm test` | Run Karma unit tests |

## Architecture

- **Framework**: Angular 20 (standalone components, signals)
- **Routing**: Hash-based (`withHashLocation()` in app.config.ts)
- **Lazy loading**: All page routes are lazy-loaded under `/home`
- **Path aliases**: Use `@services/`, `@components/`, `@enviroments/` instead of relative paths

## Code Conventions

- Private fields use `#` prefix (e.g., `private #service = inject(Service)`)
- Services are tree-shakeable (`providedIn: 'root'` not explicitly set)
- Standalone components only (no NgModules)
- Environment: `src/environments/environment.development.ts` for dev, `environment.ts` for prod

## Key Files

- Routes: `src/app/app.routes.ts`
- App config: `src/app/app.config.ts`
- Main entry: `src/main.ts`

## Testing

- Karma + Jasmine (configured in `angular.json`)
- Test files: `*.spec.ts` colocated with components/services

## Prettier

- Config in `package.json` (printWidth: 100, singleQuote: true)
- Format HTML templates with Angular parser

## Dependencies

- Angular Material (prebuilt theme: azure-blue)
- ngx-cookie-service for cookie management