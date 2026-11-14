-- V11: Rename roadmap status 'DRAFT' to 'PRIVATE' and update column default

UPDATE roadmaps
SET visibility = 'PRIVATE'
WHERE visibility = 'DRAFT';

ALTER TABLE roadmaps
ALTER COLUMN visibility SET DEFAULT 'PRIVATE';
