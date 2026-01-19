import type { ToolContext, ToolPluginCore } from "gui-chat-protocol";
import type { MarkdownArgs, MarkdownToolData, MarkdownResult } from "./types";
import { TOOL_NAME, TOOL_DEFINITION } from "./definition";

export const presentDocument = async (
  context: ToolContext,
  args: MarkdownArgs,
): Promise<MarkdownResult> => {
  let { markdown } = args;
  const { title } = args;

  // Validate that markdown is provided
  if (!markdown || markdown.trim() === "") {
    throw new Error("Markdown content is required but was not provided");
  }

  // Detect all image placeholders in the format: ![prompt](__too_be_replaced_image_path__)
  // Also handle variant with leading slash: ![prompt](/__too_be_replaced_image_path__)
  const imageRegex = /!\[([^\]]+)\]\(\/?__too_be_replaced_image_path__\)/g;
  const matches = [...markdown.matchAll(imageRegex)];

  if (matches.length > 0 && context.app?.generateImageWithBackend && context.app?.saveImages) {
    // Generate UUID for this document
    const docUuid = crypto.randomUUID();
    const images: Record<string, string> = {};

    // Load blank image for aspect ratio reference
    const blankImageBase64 = context.app.loadBlankImageBase64
      ? await context.app.loadBlankImageBase64()
      : "";

    // Generate images for each placeholder in parallel
    const imagePromises = matches.map(async (match, i) => {
      const prompt = `${match[1]}. Use the last image as the output dimension.`;
      const imageId = `image_${i}`;

      try {
        const result = await context.app!.generateImageWithBackend!(
          prompt,
          blankImageBase64 ? [blankImageBase64] : [],
          context,
        );

        if (result.success && result.imageData) {
          images[imageId] = `data:image/png;base64,${result.imageData}`;
        }
      } catch (error) {
        console.error(`Failed to generate image for prompt: ${prompt}`, error);
      }
    });

    await Promise.all(imagePromises);

    // Save images to server and get URLs
    if (Object.keys(images).length > 0) {
      try {
        const data = await context.app.saveImages({ uuid: docUuid, images });

        if (data.imageUrls) {
          const imageUrls = data.imageUrls;

          // Replace placeholders with actual image URLs
          let imageIndex = 0;
          markdown = markdown.replace(imageRegex, (match, prompt) => {
            const imageId = `image_${imageIndex}`;
            const imageUrl = imageUrls[imageId];
            imageIndex++;
            return imageUrl ? `![${prompt}](${imageUrl})` : match;
          });
        }
      } catch (error) {
        console.error("Failed to save images:", error);
      }
    }

    return {
      message: `Created markdown document: ${title}`,
      title,
      data: { markdown },
      uuid: docUuid,
      instructions:
        "Acknowledge that the document has been created and is displayed to the user.",
    };
  }

  return {
    message: `Created markdown document: ${title}`,
    title,
    data: { markdown },
    instructions:
      "Acknowledge that the document has been created and is displayed to the user.",
  };
};

export const pluginCore: ToolPluginCore<MarkdownToolData, unknown, MarkdownArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: presentDocument,
  generatingMessage: "Creating document...",
  waitingMessage:
    "Tell the user that the document was created, will be presented to the user shortly.",
  isEnabled: () => true,
  backends: ["imageGen"],
};

export { TOOL_NAME, TOOL_DEFINITION };
export const executeMarkdown = presentDocument;
