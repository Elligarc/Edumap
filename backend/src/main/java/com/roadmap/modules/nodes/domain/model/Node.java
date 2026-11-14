package com.roadmap.modules.nodes.domain.model;

import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Node {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private Roadmap roadmap;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NodeType type;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_required", nullable = false)
    private boolean isRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_node_id")
    private Node parentNode;

    @Column(name = "position_x", nullable = false)
    private Double positionX;

    @Column(name = "position_y", nullable = false)
    private Double positionY;

    @Builder.Default
    @OneToMany(mappedBy = "node", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NodeResource> resources = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public void addResource(NodeResource resource) {
        if (resources == null) {
            resources = new ArrayList<>();
        }
        resources.add(resource);
        resource.setNode(this);
    }

    public void removeResource(NodeResource resource) {
        if (resources != null) {
            resources.remove(resource);
            resource.setNode(null);
        }
    }

    public void clearResources() {
        if (resources != null) {
            resources.clear();
        }
    }

    @PrePersist
    void onPrePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (updatedAt == null) {
            updatedAt = createdAt;
        }
        if (type == null) {
            type = NodeType.DEFAULT;
        }
        if (positionX == null) {
            positionX = 0.0;
        }
        if (positionY == null) {
            positionY = 0.0;
        }
        if (resources == null) {
            resources = new ArrayList<>();
        }
    }

    @PreUpdate
    void onPreUpdate() {
        updatedAt = Instant.now();
    }
}
