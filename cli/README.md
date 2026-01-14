# @aidbox-forms/cli

Terminal demo app for `@aidbox-forms/renderer` using `@aidbox-forms/opentui-theme`.

## Run

```bash
pnpm -C cli dev -- --questionnaire site/stories/questionnaire/samples/text-controls.json --output response.json
```

On submit, the app exits and writes a `QuestionnaireResponse` JSON to `--output`.
If `--output` is omitted, it prints the response JSON to stdout and exits.

### Flags

- `--questionnaire <path>` (required)
- `--initial-response <path>`
- `--terminology-server-url <url>`
- `--output <path>`

## Notes

- Attachment upload is not supported in TUI (TBD).
