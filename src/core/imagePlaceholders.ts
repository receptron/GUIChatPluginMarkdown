/** One `![prompt](__too_be_replaced_image_path__)` in a document, the path optionally with a leading slash. */
export interface ImagePlaceholder {
  start: number;
  end: number;
  prompt: string;
}

const PLACEHOLDER_TARGETS = [
  "(__too_be_replaced_image_path__)",
  "(/__too_be_replaced_image_path__)",
];

const targetLengthAt = (markdown: string, index: number): number =>
  PLACEHOLDER_TARGETS.find((target) => markdown.startsWith(target, index))
    ?.length ?? 0;

/**
 * The matches of /!\[([^\]]+)\]\(\/?__too_be_replaced_image_path__\)/g, left to right, in linear time.
 * A prompt holds no "]", so the only candidate ending at a given "]" starts at the first "![" after
 * the previous "]"; the pattern itself retries every "![" and is quadratic without a closing "]".
 */
export function findImagePlaceholders(markdown: string): ImagePlaceholder[] {
  const found: ImagePlaceholder[] = [];
  let from = 0;
  let open = markdown.indexOf("![");
  let close = markdown.indexOf("]");
  while (close !== -1) {
    if (open !== -1 && open < from) open = markdown.indexOf("![", from);
    const targetLength =
      open !== -1 && open + 2 < close ? targetLengthAt(markdown, close + 1) : 0;
    if (targetLength > 0) {
      const end = close + 1 + targetLength;
      found.push({ start: open, end, prompt: markdown.slice(open + 2, close) });
      from = end;
    } else {
      from = close + 1;
    }
    close = markdown.indexOf("]", from);
  }
  return found;
}

/** `markdown` with each placeholder replaced by what `replacement` returns for it and its position in the list. */
export function replaceImagePlaceholders(
  markdown: string,
  placeholders: readonly ImagePlaceholder[],
  replacement: (placeholder: ImagePlaceholder, index: number) => string,
): string {
  const pieces: string[] = [];
  const copiedUpTo = placeholders.reduce((position, placeholder, index) => {
    pieces.push(markdown.slice(position, placeholder.start), replacement(placeholder, index));
    return placeholder.end;
  }, 0);
  pieces.push(markdown.slice(copiedUpTo));
  return pieces.join("");
}
