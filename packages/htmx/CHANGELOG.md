# @formbox/htmx

## 0.7.0

### Minor Changes

- Remove the opaque `fields` property from the `Form` template contract. Custom form templates now compose explicit renderer slots such as `hiddenFields`, `children`, `paginationHtml`, and `submitButton`.

## 0.6.0

### Minor Changes

- Render `table` and `htable` choice matrices with answer cells, and expose visible HTMX form chrome through overridable templates with documented template purposes.

## 0.5.0

### Minor Changes

- Render the HTMX server-side runtime with Preact so the published package no longer depends on React or React DOM at runtime.

## 0.4.4

### Patch Changes

- [`545682a`](https://github.com/HealthSamurai/formbox-renderer/commit/545682a0239ccef04a6dd4db1cff5c9c02b9a26e) Thanks [@olimsaidov](https://github.com/olimsaidov)! - Add stable ids for rendered focusable controls so HTMX swaps can preserve focus and scroll position.

- Updated dependencies [[`545682a`](https://github.com/HealthSamurai/formbox-renderer/commit/545682a0239ccef04a6dd4db1cff5c9c02b9a26e)]:
  - @formbox/renderer@0.4.1
  - @formbox/theme@0.4.1
  - @formbox/strings@0.4.1
  - @formbox/fhir@0.4.1

## 0.4.3

### Patch Changes

- Keep validation errors visible after a submitted form is updated by HTMX change posts.

## 0.4.2

### Patch Changes

- [`ba32171`](https://github.com/HealthSamurai/formbox-renderer/commit/ba321711bf89e46ee144a622fea4eec810a263fd) Thanks [@olimsaidov](https://github.com/olimsaidov)! - Remove the deprecated `loadNativeTemplates` export.

## 0.4.1

### Patch Changes

- [`3546a2b`](https://github.com/HealthSamurai/formbox-renderer/commit/3546a2b6bdcadb8ba5bafd3283c9f86d07ee09a8) Thanks [@olimsaidov](https://github.com/olimsaidov)! - Rename the documented template loader to `loadDefaultTemplates`.

## 0.4.0

### Minor Changes

- [`3550ef8`](https://github.com/HealthSamurai/formbox-renderer/commit/3550ef8c1784ee2d259cfa9614ba6ac3dec450cb) Thanks [@olimsaidov](https://github.com/olimsaidov)! - Bump all public Formbox packages for the HTMX renderer release.

### Patch Changes

- Updated dependencies [[`3550ef8`](https://github.com/HealthSamurai/formbox-renderer/commit/3550ef8c1784ee2d259cfa9614ba6ac3dec450cb)]:
  - @formbox/fhir@0.4.0
  - @formbox/renderer@0.4.0
  - @formbox/strings@0.4.0
  - @formbox/theme@0.4.0
