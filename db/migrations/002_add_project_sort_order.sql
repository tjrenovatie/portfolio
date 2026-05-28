ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;

WITH ordered_projects AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS next_sort_order
  FROM projects
  WHERE sort_order IS NULL
)
UPDATE projects
SET sort_order = ordered_projects.next_sort_order
FROM ordered_projects
WHERE projects.id = ordered_projects.id;

ALTER TABLE projects
  ALTER COLUMN sort_order SET DEFAULT 0;

ALTER TABLE projects
  ALTER COLUMN sort_order SET NOT NULL;

CREATE INDEX IF NOT EXISTS projects_sort_order_idx
  ON projects(sort_order);
