import type { ToolResult } from "gui-chat-protocol";

export interface MarkdownToolData {
  markdown: string;
  pdfPath?: string;
}

export interface MarkdownArgs {
  title: string;
  markdown: string;
}

export type MarkdownResult = ToolResult<MarkdownToolData>;
