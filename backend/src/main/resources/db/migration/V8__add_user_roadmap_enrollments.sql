CREATE TABLE user_roadmap_enrollments (
    user_id BIGINT NOT NULL,
    roadmap_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, roadmap_id),
    CONSTRAINT fk_user_roadmap_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roadmap_enrollments_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_roadmap_enrollments_roadmap_id ON user_roadmap_enrollments(roadmap_id);
