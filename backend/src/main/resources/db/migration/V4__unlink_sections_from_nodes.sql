-- Migration V4: Unlink sections from nodes (make sections visual-only frames)

ALTER TABLE nodes DROP CONSTRAINT IF EXISTS fk_nodes_section;
DROP INDEX IF EXISTS idx_nodes_section_id;
ALTER TABLE nodes DROP COLUMN IF EXISTS section_id;
