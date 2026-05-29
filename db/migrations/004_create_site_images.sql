CREATE TABLE IF NOT EXISTS site_images (
  key TEXT PRIMARY KEY,
  blob_url TEXT NOT NULL,
  blob_download_url TEXT,
  blob_pathname TEXT NOT NULL UNIQUE,
  blob_content_type TEXT NOT NULL DEFAULT 'image/avif',
  blob_size BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS site_images_set_updated_at ON site_images;

CREATE TRIGGER site_images_set_updated_at
BEFORE UPDATE ON site_images
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
