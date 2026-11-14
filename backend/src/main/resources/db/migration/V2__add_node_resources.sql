-- Migration V2: Add node_resources table for external learning resources (YouTube, documentation, websites)

CREATE TABLE node_resources (
    id BIGSERIAL PRIMARY KEY,
    node_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'WEBSITE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_node_resources_node FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

CREATE INDEX idx_node_resources_node_id ON node_resources(node_id);
