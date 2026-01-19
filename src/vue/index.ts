import "../style.css";

import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { MarkdownToolData, MarkdownArgs } from "../core/types";
import { pluginCore } from "../core/plugin";
import { samples } from "../core/samples";
import View from "./View.vue";
import Preview from "./Preview.vue";

export const TOOL_NAME = "presentDocument";

export const SYSTEM_PROMPT = `Use the ${TOOL_NAME} tool to create structured documents with text and embedded images. This tool is ideal for:
- Guides, tutorials, and how-to content ("create a guide about...", "explain how to...")
- Educational content (lessons, explanations, timelines, concept visualizations)
- Reports and presentations (business reports, data analysis, infographics)
- Articles and blog posts with illustrations
- Documentation with diagrams or screenshots
- Recipes with step-by-step photos
- Travel guides with location images
- Product presentations or lookbooks
- Any content that combines written information with supporting visuals

IMPORTANT: Use this tool instead of just generating standalone images when the user wants informational or educational content with visuals. This creates a cohesive document with formatted text (markdown) AND images embedded at appropriate locations. For example, if asked to "create a guide about photosynthesis with a diagram", use ${TOOL_NAME} to create a full guide with explanatory text and the diagram embedded, rather than just generating the diagram image alone.

Format embedded images as: ![Detailed image prompt](__too_be_replaced_image_path__)`;

export const plugin: ToolPlugin<MarkdownToolData, unknown, MarkdownArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
  samples,
  systemPrompt: SYSTEM_PROMPT,
};

export type { MarkdownToolData, MarkdownArgs, MarkdownResult } from "../core/types";

export {
  TOOL_DEFINITION,
  executeMarkdown,
  pluginCore,
} from "../core/plugin";

export { samples } from "../core/samples";

export { View, Preview };

export default { plugin };
