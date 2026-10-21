import { test, describe } from "node:test";
import assert from "node:assert";
import {
  findImagePlaceholders,
  replaceImagePlaceholders,
} from "../src/core/imagePlaceholders.js";

// The pattern the scanner replaced: correct, but quadratic, so only an oracle for small inputs.
const PLACEHOLDER_PATTERN =
  /!\[([^\]]+)\]\(\/?__too_be_replaced_image_path__\)/g;

const TOKENS = [
  "!", "[", "]", "(", ")", "/", "\\", "a", " ", "\n", "![", "](", "]]", "[[",
  "(__too_be_replaced_image_path__)", "(/__too_be_replaced_image_path__)",
  "__too_be_replaced_image_path__", "(__too_be_replaced_image_path_)",
];
const GENERATED_DOCUMENTS = 5000;
const MAX_TOKENS = 24;
const SEED = 43;

const lcg = (seed: number) => {
  let state = seed >>> 0;
  return (below: number): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % below;
  };
};

const generatedDocuments = (): string[] => {
  const next = lcg(SEED);
  return Array.from({ length: GENERATED_DOCUMENTS }, () =>
    Array.from({ length: next(MAX_TOKENS + 1) }, () => TOKENS[next(TOKENS.length)]).join(""),
  );
};

const patternMatches = (markdown: string) =>
  [...markdown.matchAll(PLACEHOLDER_PATTERN)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    prompt: match[1],
  }));

const urlFor = (index: number) => (index % 2 === 0 ? `/images/${index}.png` : undefined);

describe("findImagePlaceholders", () => {
  test("finds both forms of the placeholder with their prompts", () => {
    const markdown = "a ![a cat](__too_be_replaced_image_path__) b ![a dog](/__too_be_replaced_image_path__)";
    assert.deepEqual(
      findImagePlaceholders(markdown).map(({ prompt }) => prompt),
      ["a cat", "a dog"],
    );
  });

  test("ignores an empty prompt, another path, and an ordinary image", () => {
    ["![](__too_be_replaced_image_path__)", "![x](other.png)", "![x](__too_be_replaced_image_path__", "plain text", ""].forEach(
      (markdown) => assert.deepEqual(findImagePlaceholders(markdown), []),
    );
  });

  test("returns the pattern's matches on generated documents", () => {
    generatedDocuments().forEach((markdown) =>
      assert.deepEqual(findImagePlaceholders(markdown), patternMatches(markdown), JSON.stringify(markdown)),
    );
  });

  test("stays fast on many '![' with no closing ']'", () => {
    const LONG_INPUT_REPEATS = 200_000;
    // The pattern took seconds at a fifth of this length; a linear scan takes milliseconds.
    const BUDGET_MS = 1000;
    const markdown = "![" + "![\\".repeat(LONG_INPUT_REPEATS) + "](__too_be_replaced_image_path__)";
    const startedAt = performance.now();
    const [only] = findImagePlaceholders(markdown);
    assert.ok(performance.now() - startedAt < BUDGET_MS);
    assert.equal(only.start, 0);
    assert.equal(only.end, markdown.length);
  });
});

describe("replaceImagePlaceholders", () => {
  test("gives the same document as replacing through the pattern", () => {
    generatedDocuments().forEach((markdown) => {
      let index = 0;
      const expected = markdown.replace(PLACEHOLDER_PATTERN, (match, prompt: string) => {
        const url = urlFor(index++);
        return url ? `![${prompt}](${url})` : match;
      });
      const actual = replaceImagePlaceholders(markdown, findImagePlaceholders(markdown), (placeholder, position) => {
        const url = urlFor(position);
        return url ? `![${placeholder.prompt}](${url})` : markdown.slice(placeholder.start, placeholder.end);
      });
      assert.equal(actual, expected, JSON.stringify(markdown));
    });
  });
});
