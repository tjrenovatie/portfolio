CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  thumbnail_image_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'gallery',
  blob_url TEXT NOT NULL,
  blob_download_url TEXT,
  blob_pathname TEXT NOT NULL UNIQUE,
  blob_content_type TEXT NOT NULL DEFAULT 'image/avif',
  blob_size BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT project_images_role_check CHECK (role IN ('thumbnail', 'gallery'))
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_thumbnail_image_id_fkey'
  ) THEN
    ALTER TABLE projects
      ADD CONSTRAINT projects_thumbnail_image_id_fkey
      FOREIGN KEY (thumbnail_image_id)
      REFERENCES project_images(id)
      ON DELETE SET NULL;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS project_images_project_id_idx
  ON project_images(project_id);

CREATE INDEX IF NOT EXISTS project_images_role_idx
  ON project_images(role);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_set_updated_at ON projects;

CREATE TRIGGER projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
