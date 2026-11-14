-- Migration V3: Add roadmap_sections and roadmap_texts for canvas layout, add section_id and coordinates to nodes

CREATE TABLE roadmap_sections (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    width DOUBLE PRECISION,
    height DOUBLE PRECISION,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sections_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

CREATE INDEX idx_sections_roadmap_id ON roadmap_sections(roadmap_id);

ALTER TABLE nodes
    ADD COLUMN section_id BIGINT,
    ADD COLUMN position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD CONSTRAINT fk_nodes_section FOREIGN KEY (section_id) REFERENCES roadmap_sections(id) ON DELETE CASCADE;

CREATE INDEX idx_nodes_section_id ON nodes(section_id);

CREATE TABLE roadmap_texts (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_texts_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE
);

CREATE INDEX idx_texts_roadmap_id ON roadmap_texts(roadmap_id);
