export const TOOL_NAME = "presentDocument";

export const TOOL_DEFINITION = {
  type: "function" as const,
  name: TOOL_NAME,
  description: "Display a document in markdown format.",
  parameters: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "Title for the document",
      },
      markdown: {
        type: "string",
        description:
          "The markdown content to display. Describe embedded images in the following format: ![Detailed image prompt](__too_be_replaced_image_path__). IMPORTANT: For embedded images, you MUST use the EXACT placeholder path '__too_be_replaced_image_path__'.",
      },
    },
    required: ["title", "markdown"],
  },
};
