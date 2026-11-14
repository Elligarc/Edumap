package com.roadmap.modules.nodes.application.mapper;

import com.roadmap.modules.nodes.api.dto.CreateNodeRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceResponse;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeResource;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class NodeMapper {

    public Node toEntity(CreateNodeRequest request, Roadmap roadmap, Node parentNode) {
        Node node = Node.builder()
                .roadmap(roadmap)
                .title(request.title())
                .type(request.type())
                .content(request.content())
                .isRequired(request.isRequired() != null && request.isRequired())
                .parentNode(parentNode)
                .positionX(request.positionX() != null ? request.positionX() : 0.0)
                .positionY(request.positionY() != null ? request.positionY() : 0.0)
                .build();

        if (request.resources() != null) {
            for (NodeResourceRequest resReq : request.resources()) {
                node.addResource(toResourceEntity(resReq));
            }
        }

        return node;
    }

    public NodeResource toResourceEntity(NodeResourceRequest request) {
        return NodeResource.builder()
                .title(request.title())
                .url(request.url())
                .type(request.type())
                .build();
    }

    public NodeResourceResponse toResourceResponse(NodeResource resource) {
        return new NodeResourceResponse(
                resource.getId(),
                resource.getTitle(),
                resource.getUrl(),
                resource.getType()
        );
    }

    public NodeResponse toResponse(Node node) {
        Long roadmapId = node.getRoadmap() != null ? node.getRoadmap().getId() : null;
        Long parentNodeId = node.getParentNode() != null ? node.getParentNode().getId() : null;
        Double positionX = node.getPositionX() != null ? node.getPositionX() : 0.0;
        Double positionY = node.getPositionY() != null ? node.getPositionY() : 0.0;

        List<NodeResourceResponse> resourceResponses = node.getResources() != null
                ? node.getResources().stream().map(this::toResourceResponse).toList()
                : Collections.emptyList();

        return new NodeResponse(
                node.getId(),
                roadmapId,
                node.getTitle(),
                node.getType(),
                node.getContent(),
                node.isRequired(),
                parentNodeId,
                positionX,
                positionY,
                resourceResponses,
                node.getCreatedAt(),
                node.getUpdatedAt()
        );
    }
}
