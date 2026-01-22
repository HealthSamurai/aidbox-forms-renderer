# Spec Tests — Agent Notes

Source of truth:

- `COVERAGE.md` defines the checkbox hierarchy and where tests live.
- Use `docs/` XML extracts for spec details.

Rules:

- One test file per checkbox under the owning profile/resource path.
- For extension slices, use the slice name as the directory name.
- For coding extensions (itemControl, keyboardType, disabledDisplay), create a file per code value; use `it.todo` when not covered.
- When creating a new folder for a TODO item, add the folder link in `COVERAGE.md`.
- If a slice appears in multiple profiles, keep one canonical test and add thin wrapper files in other profile paths noting coverage.
