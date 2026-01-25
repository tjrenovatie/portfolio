import Image, { type ImageProps } from "next/image";
import { getFirstBlobUrl } from "@/lib/vercel-blob";

type BlobImageProps = Omit<ImageProps, "src"> & {
  blobPrefix: string;
  fallbackSrc?: string;
};

// ← GEEN 'use client' hier!
export default async function BlobImage({
  blobPrefix,
  fallbackSrc,
  alt,
  ...props
}: BlobImageProps) {
  const src = await getFirstBlobUrl(blobPrefix, fallbackSrc);

  return <Image src={src} alt={alt ?? ""} {...props} />;
}
