package com.roadmap.modules.nodes.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.modules.nodes.api.dto.CanvasNodeSyncItem;
import com.roadmap.modules.nodes.api.dto.CanvasSectionSyncItem;
import com.roadmap.modules.nodes.api.dto.CanvasTextSyncItem;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapCanvasResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.SyncCanvasRequest;
import com.roadmap.modules.nodes.application.mapper.NodeMapper;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
import com.roadmap.modules.nodes.domain.exception.RoadmapTextNotFoundException;
import com.roadmap.modules.nodes.domain.exception.SectionNotFoundException;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoadmapCanvasService {

    private final RoadmapService roadmapService;
    private final NodeService nodeService;
    private final SectionService sectionService;
    private final RoadmapTextService textService;
    private final RoadmapEdgeService edgeService;
    private final NodeRepository nodeRepository;
    private final SectionRepository sectionRepository;
    private final RoadmapTextRepository textRepository;
    private final NodeMapper nodeMapper;

    public RoadmapCanvasResponse getCanvasByRoadmapId(Long roadmapId) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        roadmapService.validateRoadmapAccess(roadmap);
        List<SectionResponse> sections = sectionService.getSectionsByRoadmapId(roadmapId);
        List<NodeResponse> nodes = nodeService.getNodesByRoadmapId(roadmapId);
        List<RoadmapTextResponse> texts = textService.getTextsByRoadmapId(roadmapId);
        List<RoadmapEdgeResponse> edges = edgeService.getEdgesByRoadmapId(roadmapId);

        return new RoadmapCanvasResponse(
                roadmap.getId(),
                roadmap.getTitle(),
                sections,
                nodes,
                texts,
                edges
        );
    }

    @Transactional
    public RoadmapCanvasResponse syncCanvas(Long roadmapId, SyncCanvasRequest request) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);

        processDeletions(roadmapId, request);

        if (request.sections() != null && !request.sections().isEmpty()) {
            syncSections(roadmap, request.sections());
        }

        if (request.texts() != null && !request.texts().isEmpty()) {
            syncTexts(roadmap, request.texts());
        }

        Map<Long, Node> nodeMap = new HashMap<>();
        if (request.nodes() != null && !request.nodes().isEmpty()) {
            nodeMap = syncNodes(roadmap, request.nodes());
        }

        if (request.edges() != null) {
            edgeService.syncEdges(roadmapId, request.edges(), nodeMap);
        }

        log.info("Synced canvas batch for roadmap id={}", roadmapId);
        return getCanvasByRoadmapId(roadmapId);
    }

    private void processDeletions(Long roadmapId, SyncCanvasRequest request) {
        if (request.deletedNodeIds() != null) {
            request.deletedNodeIds().stream()
                    .filter(id -> id != null && id > 0)
                    .forEach(id -> nodeRepository.findById(id)
                            .filter(n -> n.getRoadmap().getId().equals(roadmapId))
                            .ifPresent(nodeRepository::delete));
        }
        if (request.deletedSectionIds() != null) {
            request.deletedSectionIds().stream()
                    .filter(id -> id != null && id > 0)
                    .forEach(id -> sectionRepository.findById(id)
                            .filter(s -> s.getRoadmap().getId().equals(roadmapId))
                            .ifPresent(sectionRepository::delete));
        }
        if (request.deletedTextIds() != null) {
            request.deletedTextIds().stream()
                    .filter(id -> id != null && id > 0)
                    .forEach(id -> textRepository.findById(id)
                            .filter(t -> t.getRoadmap().getId().equals(roadmapId))
                            .ifPresent(textRepository::delete));
        }
    }

    private void syncSections(Roadmap roadmap, List<CanvasSectionSyncItem> sectionItems) {
        Map<Long, Section> sectionMap = sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(roadmap.getId())
                .stream().collect(Collectors.toMap(Section::getId, Function.identity()));

        for (CanvasSectionSyncItem item : sectionItems) {
            if (item.id() <= 0) {
                Section section = Section.builder()
                        .roadmap(roadmap)
                        .title(item.title() != null && !item.title().isBlank() ? item.title().trim() : "Новая секция")
                        .positionX(item.positionX() != null ? item.positionX() : 0.0)
                        .positionY(item.positionY() != null ? item.positionY() : 0.0)
                        .width(item.width() != null ? item.width() : 380.0)
                        .height(item.height() != null ? item.height() : 260.0)
                        .sortOrder(item.sortOrder() != null ? item.sortOrder() : 0)
                        .build();
                sectionRepository.save(section);
            } else {
                Section section = sectionMap.computeIfAbsent(item.id(), id -> { throw new SectionNotFoundException(id); });
                if (item.title() != null && !item.title().isBlank()) section.setTitle(item.title().trim());
                if (item.positionX() != null) section.setPositionX(item.positionX());
                if (item.positionY() != null) section.setPositionY(item.positionY());
                if (item.width() != null) section.setWidth(item.width());
                if (item.height() != null) section.setHeight(item.height());
                if (item.sortOrder() != null) section.setSortOrder(item.sortOrder());
            }
        }
    }

    private void syncTexts(Roadmap roadmap, List<CanvasTextSyncItem> textItems) {
        Map<Long, RoadmapText> textMap = textRepository.findAllByRoadmapIdOrderByIdAsc(roadmap.getId())
                .stream().collect(Collectors.toMap(RoadmapText::getId, Function.identity()));

        for (CanvasTextSyncItem item : textItems) {
            if (item.id() <= 0) {
                RoadmapText text = RoadmapText.builder()
                        .roadmap(roadmap)
                        .content(item.content() != null && !item.content().isBlank() ? item.content().trim() : "Текстовая заметка")
                        .positionX(item.positionX() != null ? item.positionX() : 0.0)
                        .positionY(item.positionY() != null ? item.positionY() : 0.0)
                        .build();
                textRepository.save(text);
            } else {
                RoadmapText text = textMap.computeIfAbsent(item.id(), id -> { throw new RoadmapTextNotFoundException(id); });
                if (item.content() != null && !item.content().isBlank()) text.setContent(item.content().trim());
                if (item.positionX() != null) text.setPositionX(item.positionX());
                if (item.positionY() != null) text.setPositionY(item.positionY());
            }
        }
    }

    private Map<Long, Node> syncNodes(Roadmap roadmap, List<CanvasNodeSyncItem> nodeItems) {
        List<Node> roadmapNodes = nodeRepository.findAllByRoadmapId(roadmap.getId());
        Map<Long, Node> nodeMap = new HashMap<>(roadmapNodes.stream()
                .collect(Collectors.toMap(Node::getId, Function.identity())));

        for (CanvasNodeSyncItem item : nodeItems) {
            if (item.id() <= 0) {
                Node node = Node.builder()
                        .roadmap(roadmap)
                        .title(item.title() != null && !item.title().isBlank() ? item.title().trim() : "Новый шаг")
                        .type(item.type() != null ? item.type() : NodeType.DEFAULT)
                        .content(item.content())
                        .isRequired(item.isRequired() != null ? item.isRequired() : true)
                        .positionX(item.positionX() != null ? item.positionX() : 0.0)
                        .positionY(item.positionY() != null ? item.positionY() : 0.0)
                        .build();

                if (item.resources() != null) {
                    item.resources().forEach(r -> node.addResource(nodeMapper.toResourceEntity(r)));
                }

                Node saved = nodeRepository.save(node);
                nodeMap.put(item.id(), saved);
                nodeMap.put(saved.getId(), saved);
                roadmapNodes.add(saved);
            }
        }

        for (CanvasNodeSyncItem item : nodeItems) {
            if (item.id() > 0) {
                Node node = nodeMap.computeIfAbsent(item.id(), id -> { throw new NodeNotFoundException(id); });
                if (item.title() != null && !item.title().isBlank()) node.setTitle(item.title().trim());
                if (item.type() != null) node.setType(item.type());
                if (item.content() != null) node.setContent(item.content());
                if (item.isRequired() != null) node.setRequired(item.isRequired());
                if (item.positionX() != null) node.setPositionX(item.positionX());
                if (item.positionY() != null) node.setPositionY(item.positionY());
                if (item.resources() != null) {
                    node.clearResources();
                    item.resources().forEach(r -> node.addResource(nodeMapper.toResourceEntity(r)));
                }
            }
        }

        for (CanvasNodeSyncItem item : nodeItems) {
            if (item.parentNodeId() != null) {
                Node node = nodeMap.get(item.id());
                if (node != null) {
                    node.setParentNode(resolveParentNode(node.getId(), item.parentNodeId(), nodeMap));
                }
            }
        }

        validateStartEndUniqueness(roadmapNodes);
        return nodeMap;
    }

    private Node resolveParentNode(Long persistentNodeId, Long parentNodeId, Map<Long, Node> nodeMap) {
        if (parentNodeId == null) {
            return null;
        }
        Node parent = nodeMap.get(parentNodeId);
        if (parent == null && parentNodeId > 0) {
            parent = nodeRepository.findById(parentNodeId)
                    .orElseThrow(() -> new NodeNotFoundException(parentNodeId));
        }
        if (parent != null && parent.getId().equals(persistentNodeId)) {
            throw new BusinessRuleException(
                    "CIRCULAR_DEPENDENCY",
                    "Узел не может быть родительским для самого себя"
            );
        }
        return parent;
    }

    private void validateStartEndUniqueness(List<Node> roadmapNodes) {
        long startCount = roadmapNodes.stream().filter(n -> n.getType() == NodeType.START).count();
        if (startCount > 1) {
            throw new BusinessRuleException("DUPLICATE_NODE_TYPE", "В дорожной карте может быть только один узел с типом START");
        }
        long endCount = roadmapNodes.stream().filter(n -> n.getType() == NodeType.END).count();
        if (endCount > 1) {
            throw new BusinessRuleException("DUPLICATE_NODE_TYPE", "В дорожной карте может быть только один узел с типом END");
        }
    }
}
