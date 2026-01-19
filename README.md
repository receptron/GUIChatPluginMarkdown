# @gui-chat-plugin/markdown

[![npm version](https://badge.fury.io/js/%40gui-chat-plugin%2Fmarkdown.svg)](https://www.npmjs.com/package/@gui-chat-plugin/markdown)

Markdown document display plugin for GUI Chat applications. Create and display rich documents with markdown formatting and embedded images.

## Features

- Markdown rendering with full syntax support
- Embedded image generation via placeholders
- Download markdown as file
- Edit markdown source inline
- Responsive document layout

## Installation

```bash
yarn add @gui-chat-plugin/markdown
```

## Usage

### Vue Integration

```typescript
// In src/tools/index.ts
import MarkdownPlugin from "@gui-chat-plugin/markdown/vue";

const pluginList = [
  // ... other plugins
  MarkdownPlugin,
];

// In src/main.ts
import "@gui-chat-plugin/markdown/style.css";
```

### Core-only Usage

```typescript
import { executeMarkdown, TOOL_DEFINITION } from "@gui-chat-plugin/markdown";

// Create a markdown document
const result = await executeMarkdown(context, {
  title: "My Document",
  markdown: "# Hello World\n\nThis is **bold** text.",
});
```

## API

### MarkdownArgs

```typescript
interface MarkdownArgs {
  title: string;    // Document title
  markdown: string; // Markdown content
}
```

### MarkdownToolData

```typescript
interface MarkdownToolData {
  markdown: string;
  pdfPath?: string;  // Optional PDF path if generated
}
```

### Embedded Images

To include generated images in your markdown, use the placeholder syntax:

```markdown
![Detailed image prompt](__too_be_replaced_image_path__)
```

The plugin will automatically generate images and replace placeholders with actual URLs.

## Development

```bash
# Install dependencies
yarn install

# Run demo
yarn dev

# Build
yarn build

# Lint
yarn lint
```

## Test Prompts

Try these prompts to test the plugin:

1. "Create a markdown document explaining the basics of machine learning"
2. "Write a getting started guide for Git in markdown format"
3. "Generate a project documentation template in markdown"

## License

MIT
