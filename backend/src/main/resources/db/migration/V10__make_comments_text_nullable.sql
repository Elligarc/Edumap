ALTER TABLE comments ALTER COLUMN text DROP NOT NULL;

-- Удаляем возможные дубликаты перед созданием уникального ограничения (оставляя самую свежую запись)
DELETE FROM comments c1
WHERE c1.id < (
    SELECT MAX(c2.id)
    FROM comments c2
    WHERE c2.roadmap_id = c1.roadmap_id AND c2.author_id = c1.author_id
);

-- Ограничение уникальности: один комментарий/оценка от одного пользователя на роадмап
ALTER TABLE comments ADD CONSTRAINT uk_comments_roadmap_author UNIQUE (roadmap_id, author_id);
