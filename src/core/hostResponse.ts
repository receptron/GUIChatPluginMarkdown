export interface GeneratedImageResponse {
  success: boolean;
  imageData?: string;
}

export interface SaveImagesResponse {
  imageUrls?: Record<string, string>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === "string";

const isStringRecord = (value: unknown): value is Record<string, string> =>
  isRecord(value) &&
  Object.values(value).every((item) => typeof item === "string");

export const isGeneratedImageResponse = (
  value: unknown,
): value is GeneratedImageResponse =>
  isRecord(value) &&
  typeof value.success === "boolean" &&
  isOptionalString(value.imageData);

export const isSaveImagesResponse = (
  value: unknown,
): value is SaveImagesResponse =>
  isRecord(value) &&
  (value.imageUrls === undefined || isStringRecord(value.imageUrls));

/** `loadBlankImageBase64` returns the reference image; anything else is "no reference". */
export const readBlankImageBase64 = (value: unknown): string =>
  typeof value === "string" ? value : "";
