package com.roadmap.modules.nodes.application;

import com.roadmap.common.exception.BusinessRuleException;
import com.roadmap.modules.nodes.api.dto.CreateNodeRequest;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.UpdateNodeRequest;
import com.roadmap.modules.nodes.application.mapper.NodeMapper;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.users.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NodeServiceTest {

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private RoadmapService roadmapService;

    private NodeMapper nodeMapper;
    private NodeService nodeService;

    private Roadmap testRoadmap;
    private Roadmap otherRoadmap;

    @BeforeEach
    void setUp() {
        nodeMapper = new NodeMapper();
        nodeService = new NodeService(nodeRepository, roadmapService, nodeMapper);

        User author = User.builder().id(1L).name("alice").build();
        testRoadmap = Roadmap.builder()
                .id(10L)
                .title("Roadmap 10")
                .author(author)
                .build();
        otherRoadmap = Roadmap.builder()
                .id(20L)
                .title("Roadmap 20")
                .author(author)
                .build();
    }

    @Test
    void shouldGetNodesByRoadmapId() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node node1 = Node.builder()
                .id(101L)
                .roadmap(testRoadmap)
                .title("Node 1")
                .type(NodeType.START)
                .isRequired(true)
                .resources(new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(node1));

        List<NodeResponse> responses = nodeService.getNodesByRoadmapId(10L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).id()).isEqualTo(101L);
        assertThat(responses.get(0).roadmapId()).isEqualTo(10L);
        assertThat(responses.get(0).type()).isEqualTo(NodeType.START);
    }

    @Test
    void shouldCreateRootNode() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.existsByRoadmapIdAndType(10L, NodeType.START)).thenReturn(false);

        CreateNodeRequest request = new CreateNodeRequest(
                "Root Topic",
                NodeType.START,
                "Content",
                true,
                null,
                List.of()
        );

        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> {
            Node n = inv.getArgument(0);
            n.setId(101L);
            n.setCreatedAt(Instant.now());
            n.setUpdatedAt(Instant.now());
            return n;
        });

        NodeResponse response = nodeService.createNode(10L, request);

        assertThat(response.id()).isEqualTo(101L);
        assertThat(response.title()).isEqualTo("Root Topic");
        assertThat(response.type()).isEqualTo(NodeType.START);
        assertThat(response.parentNodeId()).isNull();
    }

    @Test
    void shouldRejectSecondStartNodeOnCreate() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.existsByRoadmapIdAndType(10L, NodeType.START)).thenReturn(true);

        CreateNodeRequest request = new CreateNodeRequest(
                "Second Start",
                NodeType.START,
                "Content",
                true,
                null,
                List.of()
        );

        assertThatThrownBy(() -> nodeService.createNode(10L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("только один начальный узел");
    }

    @Test
    void shouldRejectSecondEndNodeOnCreate() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.existsByRoadmapIdAndType(10L, NodeType.END)).thenReturn(true);

        CreateNodeRequest request = new CreateNodeRequest(
                "Second End",
                NodeType.END,
                "Content",
                true,
                null,
                List.of()
        );

        assertThatThrownBy(() -> nodeService.createNode(10L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("только один конечный узел");
    }

    @Test
    void shouldCreateChildNodeWhenParentBelongsToSameRoadmap() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node parent = Node.builder()
                .id(100L)
                .roadmap(testRoadmap)
                .title("Parent")
                .type(NodeType.START)
                .resources(new ArrayList<>())
                .build();
        when(nodeRepository.findById(100L)).thenReturn(Optional.of(parent));

        CreateNodeRequest request = new CreateNodeRequest(
                "Child Topic",
                NodeType.DEFAULT,
                "Content",
                true,
                100L,
                List.of()
        );

        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> {
            Node n = inv.getArgument(0);
            n.setId(101L);
            n.setCreatedAt(Instant.now());
            n.setUpdatedAt(Instant.now());
            return n;
        });

        NodeResponse response = nodeService.createNode(10L, request);

        assertThat(response.id()).isEqualTo(101L);
        assertThat(response.parentNodeId()).isEqualTo(100L);
    }

    @Test
    void shouldRejectCreatingChildNodeWhenParentBelongsToDifferentRoadmap() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node parentFromOtherRoadmap = Node.builder()
                .id(200L)
                .roadmap(otherRoadmap)
                .title("Other parent")
                .type(NodeType.DEFAULT)
                .resources(new ArrayList<>())
                .build();
        when(nodeRepository.findById(200L)).thenReturn(Optional.of(parentFromOtherRoadmap));

        CreateNodeRequest request = new CreateNodeRequest(
                "Child Topic",
                NodeType.DEFAULT,
                "Content",
                true,
                200L,
                List.of()
        );

        assertThatThrownBy(() -> nodeService.createNode(10L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("той же дорожной карте");
    }

    @Test
    void shouldRejectSelfReferencingParentOnUpdate() {
        Node node = Node.builder()
                .id(101L)
                .roadmap(testRoadmap)
                .title("Node")
                .type(NodeType.DEFAULT)
                .resources(new ArrayList<>())
                .build();
        when(nodeRepository.findById(101L)).thenReturn(Optional.of(node));

        UpdateNodeRequest request = new UpdateNodeRequest(
                "Node", NodeType.DEFAULT, "Content", true, 101L, null
        );

        assertThatThrownBy(() -> nodeService.updateNode(101L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("самого себя");
    }

    @Test
    void shouldUpdateNodeSuccessfully() {
        Node node = Node.builder()
                .id(101L)
                .roadmap(testRoadmap)
                .title("Old Title")
                .type(NodeType.DEFAULT)
                .content("Old Content")
                .isRequired(true)
                .resources(new ArrayList<>())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(nodeRepository.findById(101L)).thenReturn(Optional.of(node));
        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateNodeRequest request = new UpdateNodeRequest(
                "New Title", NodeType.END, "New Content", false, 0L, null
        );

        when(nodeRepository.existsByRoadmapIdAndTypeAndIdNot(10L, NodeType.END, 101L)).thenReturn(false);

        NodeResponse response = nodeService.updateNode(101L, request);

        assertThat(response.title()).isEqualTo("New Title");
        assertThat(response.type()).isEqualTo(NodeType.END);
        assertThat(response.content()).isEqualTo("New Content");
        assertThat(response.isRequired()).isFalse();
        assertThat(response.parentNodeId()).isNull();
    }

    @Test
    void shouldDeleteNode() {
        Node node = Node.builder()
                .id(101L)
                .roadmap(testRoadmap)
                .title("Node to delete")
                .type(NodeType.DEFAULT)
                .resources(new ArrayList<>())
                .build();
        when(nodeRepository.findById(101L)).thenReturn(Optional.of(node));

        nodeService.deleteNode(101L);

        verify(nodeRepository).delete(node);
    }

    @Test
    void shouldThrowWhenNodeNotFound() {
        when(nodeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> nodeService.getNodeById(999L))
                .isInstanceOf(NodeNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    void shouldCreateNodeWithCoordinates() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        CreateNodeRequest request = new CreateNodeRequest(
                "Coordinate Node",
                NodeType.DEFAULT,
                "Content",
                true,
                null,
                150.0,
                250.0,
                List.of()
        );

        when(nodeRepository.save(any(Node.class))).thenAnswer(inv -> {
            Node n = inv.getArgument(0);
            n.setId(105L);
            n.setCreatedAt(Instant.now());
            n.setUpdatedAt(Instant.now());
            return n;
        });

        NodeResponse response = nodeService.createNode(10L, request);

        assertThat(response.id()).isEqualTo(105L);
        assertThat(response.positionX()).isEqualTo(150.0);
        assertThat(response.positionY()).isEqualTo(250.0);
    }
}
