import sharp from "sharp";

export const ALLOWED_UPLOAD_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const MAX_GALLERY_IMAGE_SIZE = 15 * 1024 * 1024;
export const MAX_THUMBNAIL_IMAGE_SIZE = 10 * 1024 * 1024;

export type ConvertedAvifImage = {
  buffer: Buffer;
  contentType: "image/avif";
  height: number | null;
  originalName: string;
  outputSize: number;
  pathname: string;
  width: number | null;
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
): Promise<ConvertedAvifImage> {
  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(inputBuffer)
    .rotate()
    .avif({ quality: 72 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    contentType: "image/avif",
    height: info.height ?? null,
    originalName: file.name,
    outputSize: data.byteLength,
    pathname,
    width: info.width ?? null,
  };
}
