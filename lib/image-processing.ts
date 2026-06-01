import sharp, { type OutputInfo } from "sharp";

export const ALLOWED_UPLOAD_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_GALLERY_IMAGE_SIZE = 15 * 1024 * 1024;
export const MAX_THUMBNAIL_IMAGE_SIZE = 10 * 1024 * 1024;
const DEFAULT_AVIF_MAX_DIMENSION = 1600;
const DEFAULT_AVIF_TARGET_SIZE = 220 * 1024;
const AVIF_QUALITY_STEPS = [52, 46, 40, 34, 28, 24];
const AVIF_DIMENSION_STEPS = [1, 0.875, 0.75];

export type ConvertedAvifImage = {
  buffer: Buffer;
  contentType: "image/avif";
  height: number | null;
  originalName: string;
  outputSize: number;
  pathname: string;
  width: number | null;
};

type ConvertImageToAvifOptions = {
  maxDimension?: number;
  targetSize?: number;
};

type ConvertedAvifResult = {
  data: Buffer;
  info: OutputInfo;
};

export function validateUploadImage(
  file: File | null,
  options: {
    maxSize: number;
    requiredMessage: string;
  },
) {
  if (!file || file.size === 0) {
    return options.requiredMessage;
  }

  if (!ALLOWED_UPLOAD_IMAGE_TYPES.has(file.type)) {
    return "Use an AVIF, JPG, PNG, or WebP image.";
  }

  if (file.size > options.maxSize) {
    return `Image must be ${Math.round(options.maxSize / 1024 / 1024)} MB or smaller.`;
  }

  return null;
}

export function normalizeImageFileName(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, "");
  const normalized = nameWithoutExtension
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || "image";
}

export async function convertImageFileToAvif(
  file: File,
  pathname: string,
  options: ConvertImageToAvifOptions = {},
): Promise<ConvertedAvifImage> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const maxDimension = options.maxDimension ?? DEFAULT_AVIF_MAX_DIMENSION;
  const targetSize = options.targetSize ?? DEFAULT_AVIF_TARGET_SIZE;
  let bestResult: ConvertedAvifResult | null = null;

  for (const dimensionStep of AVIF_DIMENSION_STEPS) {
    const dimension = Math.round(maxDimension * dimensionStep);

    for (const quality of AVIF_QUALITY_STEPS) {
      const result = await sharp(inputBuffer)
        .rotate()
        .resize({
          fit: "inside",
          height: dimension,
          width: dimension,
          withoutEnlargement: true,
        })
        .avif({ effort: 6, quality })
        .toBuffer({ resolveWithObject: true });

      if (!bestResult || result.data.byteLength < bestResult.data.byteLength) {
        bestResult = result;
      }

      if (result.data.byteLength <= targetSize) {
        bestResult = result;
        break;
      }
    }

    if (bestResult && bestResult.data.byteLength <= targetSize) {
      break;
    }
  }

  if (!bestResult) {
    throw new Error("Could not convert image to AVIF.");
  }

  return {
    buffer: bestResult.data,
    contentType: "image/avif",
    height: bestResult.info.height ?? null,
    originalName: file.name,
    outputSize: bestResult.data.byteLength,
    pathname,
    width: bestResult.info.width ?? null,
  };
}
