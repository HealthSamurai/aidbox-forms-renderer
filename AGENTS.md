# aidbox-forms-renderer — Agent Notes

This repo is a pnpm workspace containing a React + TypeScript renderer for HL7® FHIR® R5 Questionnaires and several UI themes.

## Repo layout

- `packages/renderer/`: the core renderer library (React + MobX) + Vitest tests
- `packages/theme/`: theme contract/types (no tests)
- `themes/*/`: concrete themes (`hs-theme`, `nshuk-theme`, `antd-theme`, `mantine-theme`)
- `site/`: Storybook site used for docs/demo

## Tooling

- Package manager: `pnpm@10.25.0` (see root `package.json`)
- TypeScript: strict + ESM, target `ES2023` (see `tsconfig.base.json`)
- Lint: ESLint flat config (`eslint.config.js`)
- Format: Prettier (also run via lint-staged)
- Tests: Vitest (currently in `packages/renderer/`)

## Install

- `pnpm install`
- CI equivalent: `pnpm install --frozen-lockfile`

## Common workspace commands (run from repo root)

- Dev playground (renderer): `pnpm dev`
- Build all packages: `pnpm build`
- Lint all packages: `pnpm lint`
- Typecheck all packages: `pnpm typecheck`
- Test all packages: `pnpm test`
- Format packages that define it: `pnpm format`

Notes:

- Root scripts use `pnpm -r run --if-present ...` (packages without a script are skipped).
- Pre-commit hook runs `pnpm lint-staged` (formats staged files via Prettier).
- CI uses Node `22` (GitHub Pages) and Node `24` (npm publish).

## Package-scoped commands (preferred for speed)

Use `pnpm --filter <pkg> <script>` or `pnpm -C <dir> <script>`.

Renderer (`@aidbox-forms/renderer`):

- `pnpm --filter @aidbox-forms/renderer dev`
- `pnpm --filter @aidbox-forms/renderer build`
- `pnpm --filter @aidbox-forms/renderer lint`
- `pnpm --filter @aidbox-forms/renderer typecheck`
- `pnpm --filter @aidbox-forms/renderer test`
- `pnpm --filter @aidbox-forms/renderer format`

Storybook site (`@aidbox-forms/site`):

- `pnpm --filter @aidbox-forms/site dev`
- `pnpm --filter @aidbox-forms/site build`

Themes/examples (build-only):

- `pnpm --filter @aidbox-forms/hs-theme build`
- `pnpm --filter @aidbox-forms/nshuk-theme build`
- `pnpm --filter @aidbox-forms/antd-theme build`
- `pnpm --filter @aidbox-forms/mantine-theme build`

## Running a single test (Vitest)

Tests live under `packages/renderer/lib/**/__tests__/*`.

From repo root (recommended):

- Run one file: `pnpm --filter @aidbox-forms/renderer test -- lib/store/form/__tests__/validation.test.ts`
- Run one test by name: `pnpm --filter @aidbox-forms/renderer test -- -t "filters options by search query"`
- Run once (CI style): `pnpm --filter @aidbox-forms/renderer test -- --run`

From the package directory (alternative):

- `pnpm -C packages/renderer test -- lib/__tests__/utilities.test.ts`

## Linting / formatting (single file)

- Lint one file: `pnpm --filter @aidbox-forms/renderer lint -- lib/store/form/form-store.ts`
- Format one file: `pnpm --filter @aidbox-forms/renderer format -- lib/store/form/form-store.ts`

## Code style (enforced by Prettier + ESLint)

### Formatting

- Use Prettier; don’t hand-format.
- No repo-wide Prettier config was found; defaults apply (double quotes, semicolons, trailing commas).
- `.prettierignore` ignores `pnpm-lock.yaml`.

### Imports / modules

- This is an ESM repo (`"type": "module"`); use `import`/`export`.
- Keep `.ts`/`.tsx` extensions in local imports (repo uses `allowImportingTsExtensions` and imports like `../foo.ts`).
- Prefer `node:`-prefixed Node builtins (e.g. `import path from "node:path"`).
- Use `import type { ... }` for type-only imports.
- Group imports logically (builtins → external → internal/relative), separated by blank lines.

### Naming / structure

- File names: kebab-case (`form-store.ts`, `node-header.tsx`).
- React components, classes, types: PascalCase.
- Functions/variables: camelCase; constants: UPPER_SNAKE_CASE.
- Predicate booleans: `is*`, `has*`, `can*`, `should*`.
- Prefer `readonly` arrays/props when practical.

### TypeScript

- Strict TS: do not introduce unused locals/params.
- `exactOptionalPropertyTypes` is enabled:
  - Prefer `value: T | undefined` over `value?: T` when “absence” is part of the domain.
  - Prefer `undefined` over `null` for missing values.
- `noUncheckedSideEffectImports` is enabled: avoid side-effect-only imports unless required.
- `@typescript-eslint/no-explicit-any` is `error`: use `unknown`, generics, or narrow types.

### React

- Follow `eslint-plugin-react-hooks` rules; keep dependency arrays correct.
- Keep renderer logic in stores/utilities; keep theme components responsible for DOM and styling.

### MobX (renderer stores)

- Use decorators (`@observable`, `@computed`, `@action`) + `makeObservable(this)` in the constructor.
- Do not use `makeAutoObservable`.
- Do not use `makeObservable` with explicit annotation objects.

## Renderer-specific constraints (`packages/renderer/lib`)

These are enforced by ESLint:

- No raw DOM elements in JSX (e.g. no `<div>`, `<input>`); use theme components instead.
- Do not set `className` or `style` props in renderer JSX; styling belongs in the theme layer.
- `@typescript-eslint/switch-exhaustiveness-check` is `error` (write exhaustive switches).

## Error handling

- Use `assertDefined()` (and similar) to narrow `T | undefined` before use.
- Throw `Error`/`TypeError` for invariants/programmer mistakes.
- For user-facing validation/rendering problems, prefer producing FHIR `OperationOutcomeIssue` via existing utilities/validators.

## Testing

- Runner: Vitest + jsdom (see `packages/renderer/vitest.config.ts`).
- Prefer small, isolated tests with explicit fixtures.
- Use `describe`/`it` with meaningful names; avoid mega-tests.
- Use Testing Library + `user-event` for React interactions.

## Existing agent rules

- `packages/renderer/AGENTS.md` contains deeper renderer-domain conventions; follow it for any work under `packages/renderer/`.

## Cursor/Copilot rules

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` were found in this repository.
