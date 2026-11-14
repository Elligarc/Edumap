package com.roadmap.modules.nodes.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.common.exception.ResourceNotFoundException;
import com.roadmap.modules.nodes.api.dto.CreateNodeRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceResponse;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.UpdateNodeRequest;
import com.roadmap.modules.nodes.application.mapper.NodeMapper;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeResource;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NodeService {

    private final NodeRepository nodeRepository;
    private final RoadmapService roadmapService;
    private final NodeMapper nodeMapper;

    public List<NodeResponse> getNodesByRoadmapId(Long roadmapId) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        roadmapService.validateRoadmapAccess(roadmap);
        return nodeRepository.findAllByRoadmapId(roadmapId).stream()
                .map(nodeMapper::toResponse)
                .toList();
    }

    @Transactional
    public NodeResponse createNode(Long roadmapId, CreateNodeRequest request) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);

        validateNodeTypeUniqueness(roadmapId, request.type(), null);

        Node parentNode = null;
        if (request.parentNodeId() != null) {
            parentNode = findNodeOrThrow(request.parentNodeId());
            validateSameRoadmap(roadmap, parentNode);
        }

        Node node = nodeMapper.toEntity(request, roadmap, parentNode);
        Node saved = nodeRepository.save(node);
        log.info("Created node id={} (type={}) in roadmap id={}", saved.getId(), saved.getType(), roadmapId);
        return nodeMapper.toResponse(saved);
    }

    public NodeResponse getNodeById(Long nodeId) {
        Node node = findNodeOrThrow(nodeId);
        return nodeMapper.toResponse(node);
    }

    @Transactional
    public NodeResponse updateNode(Long nodeId, UpdateNodeRequest request) {
        Node node = findNodeOrThrow(nodeId);

        if (request.title() != null && !request.title().isBlank()) {
            node.setTitle(request.title().trim());
        }
        if (request.type() != null) {
            validateNodeTypeUniqueness(node.getRoadmap().getId(), request.type(), nodeId);
            node.setType(request.type());
        }
        if (request.content() != null) {
            node.setContent(request.content());
        }
        if (request.isRequired() != null) {
            node.setRequired(request.isRequired());
        }
        if (request.parentNodeId() != null) {
            if (request.parentNodeId().equals(nodeId)) {
                throw new BusinessRuleException("CIRCULAR_DEPENDENCY", "Узел не может быть родительским для самого себя");
            }
            if (request.parentNodeId() <= 0) {
                node.setParentNode(null);
            } else {
                Node newParent = findNodeOrThrow(request.parentNodeId());
                validateSameRoadmap(node.getRoadmap(), newParent);
                node.setParentNode(newParent);
            }
        }
        if (request.positionX() != null) {
            node.setPositionX(request.positionX());
        }
        if (request.positionY() != null) {
            node.setPositionY(request.positionY());
        }
        if (request.resources() != null) {
            node.clearResources();
            for (NodeResourceRequest resReq : request.resources()) {
                node.addResource(nodeMapper.toResourceEntity(resReq));
            }
        }

        Node updated = nodeRepository.save(node);
        log.info("Updated node id={}", nodeId);
        return nodeMapper.toResponse(updated);
    }

    @Transactional
    public NodeResourceResponse addResource(Long nodeId, NodeResourceRequest request) {
        Node node = findNodeOrThrow(nodeId);
        NodeResource resource = nodeMapper.toResourceEntity(request);
        node.addResource(resource);
        nodeRepository.saveAndFlush(node);
        log.info("Added resource '{}' to node id={}", resource.getTitle(), nodeId);
        return nodeMapper.toResourceResponse(resource);
    }

    @Transactional
    public void deleteResource(Long nodeId, Long resourceId) {
        Node node = findNodeOrThrow(nodeId);
        NodeResource resource = node.getResources().stream()
                .filter(r -> resourceId.equals(r.getId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "RESOURCE_NOT_FOUND",
                        "Ресурс с ID " + resourceId + " не найден в узле " + nodeId
                ) {});
        node.removeResource(resource);
        nodeRepository.save(node);
        log.info("Removed resource id={} from node id={}", resourceId, nodeId);
    }

    @Transactional
    public void deleteNode(Long nodeId) {
        Node node = findNodeOrThrow(nodeId);
        nodeRepository.delete(node);
        log.info("Deleted node id={}", nodeId);
    }

    public Node findNodeOrThrow(Long id) {
        return nodeRepository.findById(id)
                .orElseThrow(() -> new NodeNotFoundException(id));
    }

    private void validateNodeTypeUniqueness(Long roadmapId, NodeType newType, Long excludeNodeId) {
        if (newType != NodeType.START && newType != NodeType.END) {
            return;
        }

        boolean exists = excludeNodeId == null
                ? nodeRepository.existsByRoadmapIdAndType(roadmapId, newType)
                : nodeRepository.existsByRoadmapIdAndTypeAndIdNot(roadmapId, newType, excludeNodeId);

        if (exists) {
            boolean isStart = newType == NodeType.START;
            String code = isStart ? "ROADMAP_ALREADY_HAS_START_NODE" : "ROADMAP_ALREADY_HAS_END_NODE";
            String message = isStart
                    ? "В дорожной карте может быть только один начальный узел (START)"
                    : "В дорожной карте может быть только один конечный узел (END)";
            throw new BusinessRuleException(code, message);
        }
    }

    private void validateSameRoadmap(Roadmap roadmap, Node parentNode) {
        if (!parentNode.getRoadmap().getId().equals(roadmap.getId())) {
            throw new BusinessRuleException(
                    "INVALID_PARENT_NODE",
                    "Родительский узел должен принадлежать той же дорожной карте"
            );
        }
    }
}
