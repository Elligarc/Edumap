package com.roadmap.modules.nodes.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.common.exception.ResourceNotFoundException;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.RoadmapEdge;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RoadmapEdgeService {

    private final RoadmapEdgeRepository edgeRepository;
    private final NodeRepository nodeRepository;
    private final RoadmapService roadmapService;

    public List<RoadmapEdgeResponse> getEdgesByRoadmapId(Long roadmapId) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        roadmapService.validateRoadmapAccess(roadmap);
        return edgeRepository.findAllByRoadmapId(roadmapId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<RoadmapEdgeResponse> syncEdges(Long roadmapId, List<RoadmapEdgeRequest> requests) {
        return syncEdges(roadmapId, requests, null);
    }

    @Transactional
    public List<RoadmapEdgeResponse> syncEdges(
            Long roadmapId,
            List<RoadmapEdgeRequest> requests,
            Map<Long, Node> externalNodeMap
    ) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        List<Node> roadmapNodes = nodeRepository.findAllByRoadmapId(roadmapId);

        if (requests == null || requests.isEmpty()) {
            return clearAllEdges(roadmapId, roadmapNodes);
        }

        Map<Long, Node> nodeMap = new HashMap<>(roadmapNodes.stream()
                .collect(Collectors.toMap(Node::getId, Function.identity())));
        if (externalNodeMap != null) {
            nodeMap.putAll(externalNodeMap);
        }

        List<RoadmapEdge> newEdges = new ArrayList<>();
        Map<Long, Node> targetToPrimaryParent = new HashMap<>();
        Set<String> seenNodePairs = new HashSet<>();

        for (RoadmapEdgeRequest req : requests) {
            Node sourceNode = nodeMap.get(req.sourceNodeId());
            if (sourceNode == null) {
                throw new NodeNotFoundException(req.sourceNodeId());
            }

            Node targetNode = nodeMap.get(req.targetNodeId());
            if (targetNode == null) {
                throw new NodeNotFoundException(req.targetNodeId());
            }

            if (sourceNode.getId().equals(targetNode.getId())) {
                throw new BusinessRuleException(
                        "NODE_CANNOT_CONNECT_TO_ITSELF",
                        "Узел не может ссылаться сам на себя"
                );
            }

            // макс 1 связь между нодами
            long minId = Math.min(sourceNode.getId(), targetNode.getId());
            long maxId = Math.max(sourceNode.getId(), targetNode.getId());
            String pairKey = minId + "<->" + maxId;

            if (seenNodePairs.add(pairKey)) {
                RoadmapEdge edge = RoadmapEdge.builder()
                        .roadmap(roadmap)
                        .sourceNode(sourceNode)
                        .targetNode(targetNode)
                        .sourceHandle(req.sourceHandle())
                        .targetHandle(req.targetHandle())
                        .build();
                newEdges.add(edge);

                targetToPrimaryParent.putIfAbsent(targetNode.getId(), sourceNode);
            }
        }

        edgeRepository.deleteAllByRoadmapId(roadmapId);
        List<RoadmapEdge> savedEdges = edgeRepository.saveAll(newEdges);

        for (Node node : nodeMap.values()) {
            Node primaryParent = targetToPrimaryParent.get(node.getId());
            if (primaryParent != null) {
                node.setParentNode(primaryParent);
            }
        }

        log.info("Synced {} edges for roadmap id={}", savedEdges.size(), roadmapId);
        return savedEdges.stream().map(this::toResponse).toList();
    }

    private List<RoadmapEdgeResponse> clearAllEdges(Long roadmapId, List<Node> roadmapNodes) {
        edgeRepository.deleteAllByRoadmapId(roadmapId);
        for (Node node : roadmapNodes) {
            if (node.getParentNode() != null) {
                node.setParentNode(null);
            }
        }
        log.info("Cleared all edges for roadmap id={}", roadmapId);
        return List.of();
    }

    private RoadmapEdgeResponse toResponse(RoadmapEdge edge) {
        return new RoadmapEdgeResponse(
                edge.getId(),
                edge.getSourceNode().getId(),
                edge.getTargetNode().getId(),
                edge.getSourceHandle(),
                edge.getTargetHandle()
        );
    }
}
