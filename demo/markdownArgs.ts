import type { MarkdownArgs } from "../src/core/types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isMarkdownArgs = (value: unknown): value is MarkdownArgs =>
  isRecord(value) &&
  typeof value.title === "string" &&
  typeof value.markdown === "string" &&
  (value.filenameHint === undefined || typeof value.filenameHint === "string");
