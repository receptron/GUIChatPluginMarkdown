import type { ToolSample } from "gui-chat-protocol";

export const samples: ToolSample[] = [
  {
    name: "Basic Markdown",
    args: {
      title: "Sample Document",
      markdown: `# Hello World

This is a **bold** text and this is *italic*.

## Features
- Item 1
- Item 2
- Item 3

### Code Example
\`\`\`javascript
const greeting = "Hello!";
console.log(greeting);
\`\`\`
`,
    },
  },
  {
    name: "Table Example",
    args: {
      title: "Data Table",
      markdown: `# Product List

| Name | Price | Stock |
|------|-------|-------|
| Apple | $1.00 | 50 |
| Banana | $0.50 | 100 |
| Orange | $0.75 | 30 |

> Note: Prices are subject to change.
`,
    },
  },
];
