-- Initial schema for Educational Roadmap Platform

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_login UNIQUE (login),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE roadmaps (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50) NOT NULL DEFAULT 'BEGINNER',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    author_id BIGINT NOT NULL,
    visibility VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmaps_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_roadmaps_author_id ON roadmaps(author_id);
CREATE INDEX idx_roadmaps_category ON roadmaps(category);
CREATE INDEX idx_roadmaps_visibility ON roadmaps(visibility);

CREATE TABLE nodes (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'DEFAULT',
    content TEXT,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    parent_node_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nodes_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT fk_nodes_parent_node FOREIGN KEY (parent_node_id) REFERENCES nodes(id) ON DELETE SET NULL
);

CREATE INDEX idx_nodes_roadmap_id ON nodes(roadmap_id);
CREATE INDEX idx_nodes_parent_node_id ON nodes(parent_node_id);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author_id BIGINT NOT NULL,
    roadmap_id BIGINT NOT NULL,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT chk_comments_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

CREATE INDEX idx_comments_roadmap_id ON comments(roadmap_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teams_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_teams_owner_id ON teams(owner_id);

CREATE TABLE team_members (
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, user_id),
    CONSTRAINT fk_team_members_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_members_user_id ON team_members(user_id);

CREATE TABLE user_progress (
    user_id BIGINT NOT NULL,
    node_id BIGINT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, node_id),
    CONSTRAINT fk_user_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_progress_node FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_progress_node_id ON user_progress(node_id);
