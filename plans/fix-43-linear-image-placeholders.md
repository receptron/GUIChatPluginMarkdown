# #43 — find image placeholders in linear time

`/!\[([^\]]+)\]\(\/?__too_be_replaced_image_path__\)/g` retries every `![` and scans to the end each time, so a document with many `![` and no `]` takes quadratic time.

## How
- `src/core/imagePlaceholders.ts`:
  - `findImagePlaceholders` returns the pattern's matches with one forward scan. A prompt holds no `]`, so the only candidate ending at a given `]` starts at the first `![` after the previous `]`.
  - `replaceImagePlaceholders` rebuilds the document from those matches.
- `plugin.ts` uses both in place of `matchAll` and `replace`, and replaces from the matches it already found.
- `tests/imagePlaceholders.test.ts` keeps the old pattern as the oracle. On seeded generated documents, the matches and the replaced document are compared against it, and a long input without `]` must finish within a budget.

## Left out
- What counts as a placeholder: unchanged.
