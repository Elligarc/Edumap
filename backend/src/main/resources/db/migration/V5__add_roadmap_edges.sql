-- Add roadmap_edges table to persist graph connections between nodes

CREATE TABLE roadmap_edges (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL,
    source_node_id BIGINT NOT NULL,
    target_node_id BIGINT NOT NULL,
    source_handle VARCHAR(50),
    target_handle VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_roadmap_edges_roadmap FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
    CONSTRAINT fk_roadmap_edges_source_node FOREIGN KEY (source_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_roadmap_edges_target_node FOREIGN KEY (target_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT uk_roadmap_edges UNIQUE (roadmap_id, source_node_id, target_node_id, source_handle, target_handle)
);

CREATE INDEX idx_roadmap_edges_roadmap_id ON roadmap_edges(roadmap_id);
CREATE INDEX idx_roadmap_edges_source_node_id ON roadmap_edges(source_node_id);
CREATE INDEX idx_roadmap_edges_target_node_id ON roadmap_edges(target_node_id);

-- Backfill existing parent-child relationships as default bottom -> top edges
INSERT INTO roadmap_edges (roadmap_id, source_node_id, target_node_id, source_handle, target_handle)
SELECT roadmap_id, parent_node_id, id, 'bottom', 'top'
FROM nodes
WHERE parent_node_id IS NOT NULL
ON CONFLICT DO NOTHING;
