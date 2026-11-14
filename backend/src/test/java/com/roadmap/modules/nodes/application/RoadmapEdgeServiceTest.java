package com.roadmap.modules.nodes.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.common.exception.ResourceNotFoundException;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.RoadmapEdge;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapEdgeRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapEdgeServiceTest {

    @Mock
    private RoadmapEdgeRepository edgeRepository;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private RoadmapService roadmapService;

    @InjectMocks
    private RoadmapEdgeService edgeService;

    private Roadmap testRoadmap;
    private Node node1;
    private Node node2;

    @BeforeEach
    void setUp() {
        testRoadmap = Roadmap.builder().id(10L).title("Test Roadmap").build();
        node1 = Node.builder().id(101L).roadmap(testRoadmap).title("Node 1").build();
        node2 = Node.builder().id(102L).roadmap(testRoadmap).title("Node 2").build();
    }

    @Test
    void shouldGetEdgesByRoadmapId() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        RoadmapEdge edge = RoadmapEdge.builder()
                .id(1L)
                .roadmap(testRoadmap)
                .sourceNode(node1)
                .targetNode(node2)
                .sourceHandle("bottom")
                .targetHandle("top")
                .build();
        when(edgeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(edge));

        List<RoadmapEdgeResponse> responses = edgeService.getEdgesByRoadmapId(10L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).sourceNodeId()).isEqualTo(101L);
        assertThat(responses.get(0).targetNodeId()).isEqualTo(102L);
        assertThat(responses.get(0).sourceHandle()).isEqualTo("bottom");
        assertThat(responses.get(0).targetHandle()).isEqualTo("top");
    }

    @Test
    void shouldSyncEdgesSuccessfullyAndSynchronizeParentNodeId() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1, node2));

        RoadmapEdgeRequest request = new RoadmapEdgeRequest(101L, 102L, "right", "left");
        RoadmapEdge savedEdge = RoadmapEdge.builder()
                .id(2L)
                .roadmap(testRoadmap)
                .sourceNode(node1)
                .targetNode(node2)
                .sourceHandle("right")
                .targetHandle("left")
                .build();
        when(edgeRepository.saveAll(anyList())).thenReturn(List.of(savedEdge));

        List<RoadmapEdgeResponse> result = edgeService.syncEdges(10L, List.of(request));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).sourceHandle()).isEqualTo("right");
        assertThat(result.get(0).targetHandle()).isEqualTo("left");
        assertThat(node2.getParentNode()).isEqualTo(node1);
        verify(edgeRepository).deleteAllByRoadmapId(10L);
    }

    @Test
    void shouldThrowWhenNodeConnectsToItself() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1, node2));

        RoadmapEdgeRequest request = new RoadmapEdgeRequest(101L, 101L, "bottom", "top");

        assertThatThrownBy(() -> edgeService.syncEdges(10L, List.of(request)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("Узел не может ссылаться сам на себя");
    }

    @Test
    void shouldThrowWhenNodeNotFoundInRoadmap() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1));

        RoadmapEdgeRequest request = new RoadmapEdgeRequest(101L, 999L, "bottom", "top");

        assertThatThrownBy(() -> edgeService.syncEdges(10L, List.of(request)))
                .isInstanceOf(com.roadmap.modules.nodes.domain.exception.NodeNotFoundException.class)
                .hasMessageContaining("Узел с ID 999 не найден");
    }

    @Test
    void shouldClearAllEdgesWhenListIsEmpty() {
        node2.setParentNode(node1);
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1, node2));

        List<RoadmapEdgeResponse> result = edgeService.syncEdges(10L, List.of());

        assertThat(result).isEmpty();
        assertThat(node2.getParentNode()).isNull();
        verify(edgeRepository).deleteAllByRoadmapId(10L);
    }

    @Test
    void shouldIgnoreDuplicateEdgesBetweenSameNodes() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1, node2));

        RoadmapEdgeRequest req1 = new RoadmapEdgeRequest(101L, 102L, "bottom", "top");
        RoadmapEdgeRequest req2 = new RoadmapEdgeRequest(102L, 101L, "right", "left");
        RoadmapEdgeRequest req3 = new RoadmapEdgeRequest(101L, 102L, "left", "right");

        RoadmapEdge savedEdge = RoadmapEdge.builder()
                .id(1L)
                .roadmap(testRoadmap)
                .sourceNode(node1)
                .targetNode(node2)
                .sourceHandle("bottom")
                .targetHandle("top")
                .build();
        when(edgeRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<RoadmapEdgeResponse> result = edgeService.syncEdges(10L, List.of(req1, req2, req3));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).sourceNodeId()).isEqualTo(101L);
        assertThat(result.get(0).targetNodeId()).isEqualTo(102L);
    }

    @Test
    void shouldResolveTemporaryNodeIdsFromExternalNodeMap() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1));

        Node tempNode = Node.builder().id(999L).roadmap(testRoadmap).title("New Node").build();
        Map<Long, Node> externalMap = Map.of(-1L, tempNode, 999L, tempNode);

        RoadmapEdgeRequest req = new RoadmapEdgeRequest(-1L, 101L, "bottom", "top");
        when(edgeRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<RoadmapEdgeResponse> result = edgeService.syncEdges(10L, List.of(req), externalMap);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).sourceNodeId()).isEqualTo(999L);
        assertThat(result.get(0).targetNodeId()).isEqualTo(101L);
    }
}
