/**
 * The host's image-backend calls return `unknown` since gui-chat-protocol
 * 2.0.0, so the plugin narrows them here instead of trusting the host's shape.
 *
 * Run with: yarn test
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import {
  isGeneratedImageResponse,
  isSaveImagesResponse,
  readBlankImageBase64,
} from "../src/core/hostResponse.js";

describe("isGeneratedImageResponse", () => {
  test("accepts a successful response carrying image data", () => {
    assert.equal(
      isGeneratedImageResponse({ success: true, imageData: "base64" }),
      true,
    );
  });

  test("accepts a failure response with no image data", () => {
    assert.equal(isGeneratedImageResponse({ success: false }), true);
  });

  test("rejects a response without a boolean success flag", () => {
    assert.equal(isGeneratedImageResponse({ imageData: "base64" }), false);
  });

  test("rejects values that are not a response object", () => {
    [null, undefined, "ok", 7].forEach((value) => {
      assert.equal(
        isGeneratedImageResponse(value),
        false,
        `should reject ${JSON.stringify(value)}`,
      );
    });
  });
});

describe("isSaveImagesResponse", () => {
  test("accepts a map of image id to url", () => {
    assert.equal(
      isSaveImagesResponse({ imageUrls: { image_0: "/a.png", image_1: "/b.png" } }),
      true,
    );
  });

  test("accepts a response with no imageUrls key", () => {
    assert.equal(isSaveImagesResponse({}), true);
  });

  test("rejects a map whose values are not all urls", () => {
    assert.equal(isSaveImagesResponse({ imageUrls: { image_0: 42 } }), false);
  });

  test("rejects values that are not a response object", () => {
    [null, undefined, "ok", 7].forEach((value) => {
      assert.equal(
        isSaveImagesResponse(value),
        false,
        `should reject ${JSON.stringify(value)}`,
      );
    });
  });
});

describe("readBlankImageBase64", () => {
  test("passes a string through", () => {
    assert.equal(readBlankImageBase64("base64"), "base64");
  });

  test("falls back to no reference image for anything else", () => {
    [null, undefined, 7, {}].forEach((value) => {
      assert.equal(readBlankImageBase64(value), "");
    });
  });
});
