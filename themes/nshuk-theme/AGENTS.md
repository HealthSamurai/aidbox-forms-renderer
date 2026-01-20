# @formbox/nshuk-theme — Agent Notes

This file applies to `themes/nshuk-theme/**` and supplements the root `AGENTS.md`.

## Styled component naming

This theme uses `styled` from `@linaria/react`.

- Prefer short, role-based names for file-local styled components.
- Reuse a small vocabulary: `Root`, `Container`, `Wrapper`, `Row`, `Column`, `Header`, `Body`, `Footer`, `Field`, `Control`, `Input`, `Label`, `Text`, `Icon`, `Actions`, `Panel`, `Listbox`, `Option`, `Chip`, `Slot`.
- Avoid repeating the parent component name (e.g. in `select-input.tsx`, prefer `Input` over `SelectInputField`).
- Use suffixes sparingly to clarify intent: `*Row`, `*Column`, `*Text`, `*Icon`, `*Slot`.
- Use adjective variants for state/layout: `StickyOption`, `SelectedOption`, `DisabledOption`, etc.
- Keep accessibility primitives explicit: `VisuallyHidden` stays `VisuallyHidden`.
- If a styled component is exported, prefer a more specific name (it becomes public API).
