import type { ToolResult } from "gui-chat-protocol";

export interface MarkdownToolData {
  markdown: string;
  pdfPath?: string;
  filenameHint?: string;
}

export interface MarkdownArgs {
  title: string;
  markdown: string;
  filenameHint?: string;
}

export type MarkdownResult = ToolResult<MarkdownToolData>;
