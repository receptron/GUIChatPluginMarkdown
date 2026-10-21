# ChangeLog

## @gui-chat-plugin/markdown@2.1.1 (2026-10-22)

- **Find image placeholders in linear time** (#44, fixes #43): the placeholder pattern was quadratic on a document with many `![` and no closing `]`; a forward scan returns the same matches.
- **Prettier** (#41): adds `yarn format` / `yarn format:check` and formats the sources.
- **Dependencies** (#33): `@humanfs/node` 0.16.8.

