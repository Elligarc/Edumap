package com.roadmap.modules.nodes.application;

import com.roadmap.modules.nodes.api.dto.CanvasNodeSyncItem;
import com.roadmap.modules.nodes.api.dto.CanvasSectionSyncItem;
import com.roadmap.modules.nodes.api.dto.CanvasTextSyncItem;
import com.roadmap.modules.nodes.api.dto.NodeResourceRequest;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapCanvasResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.SyncCanvasRequest;
import com.roadmap.modules.nodes.application.mapper.NodeMapper;
import com.roadmap.modules.nodes.domain.model.Node;
import com.roadmap.modules.nodes.domain.model.NodeResource;
import com.roadmap.modules.nodes.domain.model.NodeType;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.NodeRepository;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.roadmap.common.exception.BusinessRuleException;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class RoadmapCanvasServiceTest {

    @Mock
    private RoadmapService roadmapService;

    @Mock
    private NodeService nodeService;

    @Mock
    private SectionService sectionService;

    @Mock
    private RoadmapTextService textService;

    @Mock
    private RoadmapEdgeService edgeService;

    @Mock
    private NodeRepository nodeRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private RoadmapTextRepository textRepository;

    @Mock
    private NodeMapper nodeMapper;

    @InjectMocks
    private RoadmapCanvasService canvasService;

    private Roadmap testRoadmap;

    @BeforeEach
    void setUp() {
        testRoadmap = Roadmap.builder().id(10L).title("Test Roadmap").build();
    }

    @Test
    void shouldGetFullCanvasState() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        SectionResponse section = new SectionResponse(
                1L, 10L, "Section A", 100.0, 200.0, 400.0, 300.0, 0, Instant.now(), Instant.now()
        );
        NodeResponse node = new NodeResponse(
                101L, 10L, "Node A", NodeType.START, "Content", true, null, 120.0, 220.0, List.of(), Instant.now(), Instant.now()
        );
        RoadmapTextResponse text = new RoadmapTextResponse(
                201L, 10L, "Canvas Note", 50.0, 60.0, Instant.now(), Instant.now()
        );
        RoadmapEdgeResponse edge = new RoadmapEdgeResponse(
                301L, 101L, 102L, "bottom", "top"
        );

        when(sectionService.getSectionsByRoadmapId(10L)).thenReturn(List.of(section));
        when(nodeService.getNodesByRoadmapId(10L)).thenReturn(List.of(node));
        when(textService.getTextsByRoadmapId(10L)).thenReturn(List.of(text));
        when(edgeService.getEdgesByRoadmapId(10L)).thenReturn(List.of(edge));

        RoadmapCanvasResponse canvas = canvasService.getCanvasByRoadmapId(10L);

        assertThat(canvas.roadmapId()).isEqualTo(10L);
        assertThat(canvas.title()).isEqualTo("Test Roadmap");
        assertThat(canvas.sections()).hasSize(1);
        assertThat(canvas.nodes()).hasSize(1);
        assertThat(canvas.texts()).hasSize(1);
        assertThat(canvas.edges()).hasSize(1);
        assertThat(canvas.edges().get(0).sourceHandle()).isEqualTo("bottom");
        assertThat(canvas.edges().get(0).targetHandle()).isEqualTo("top");
    }

    @Test
    void shouldSyncCanvasSuccessfully() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node existingNode = Node.builder()
                .id(101L)
                .roadmap(testRoadmap)
                .title("Old Title")
                .type(NodeType.DEFAULT)
                .positionX(100.0)
                .positionY(100.0)
                .isRequired(true)
                .resources(new ArrayList<>())
                .build();

        Section existingSection = Section.builder()
                .id(1L)
                .roadmap(testRoadmap)
                .title("Old Section")
                .positionX(50.0)
                .positionY(50.0)
                .width(200.0)
                .height(200.0)
                .build();

        RoadmapText existingText = RoadmapText.builder()
                .id(201L)
                .roadmap(testRoadmap)
                .content("Old Content")
                .positionX(10.0)
                .positionY(10.0)
                .build();

        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(List.of(existingNode));
        when(sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(10L)).thenReturn(List.of(existingSection));
        when(textRepository.findAllByRoadmapIdOrderByIdAsc(10L)).thenReturn(List.of(existingText));

        NodeResourceRequest resReq = new NodeResourceRequest("Docs", "https://example.com", "DOCS");
        when(nodeMapper.toResourceEntity(any(NodeResourceRequest.class))).thenReturn(
                NodeResource.builder().title("Docs").url("https://example.com").type("DOCS").build()
        );

        SyncCanvasRequest request = new SyncCanvasRequest(
                List.of(new CanvasNodeSyncItem(101L, "New Title", NodeType.DEFAULT, "Updated content", false, 150.0, 250.0, null, List.of(resReq))),
                List.of(new CanvasSectionSyncItem(1L, "New Section", 60.0, 70.0, 500.0, 400.0, 1)),
                List.of(new CanvasTextSyncItem(201L, "New Content", 20.0, 30.0)),
                List.of(new RoadmapEdgeRequest(101L, 102L, "bottom", "top"))
        );

        when(sectionService.getSectionsByRoadmapId(10L)).thenReturn(List.of());
        when(nodeService.getNodesByRoadmapId(10L)).thenReturn(List.of());
        when(textService.getTextsByRoadmapId(10L)).thenReturn(List.of());
        when(edgeService.getEdgesByRoadmapId(10L)).thenReturn(List.of());

        RoadmapCanvasResponse response = canvasService.syncCanvas(10L, request);

        assertThat(response).isNotNull();
        assertThat(existingNode.getTitle()).isEqualTo("New Title");
        assertThat(existingNode.getPositionX()).isEqualTo(150.0);
        assertThat(existingNode.getPositionY()).isEqualTo(250.0);
        assertThat(existingNode.isRequired()).isFalse();
        assertThat(existingNode.getResources()).hasSize(1);
        assertThat(existingNode.getResources().get(0).getTitle()).isEqualTo("Docs");

        assertThat(existingSection.getTitle()).isEqualTo("New Section");
        assertThat(existingSection.getWidth()).isEqualTo(500.0);
        assertThat(existingSection.getHeight()).isEqualTo(400.0);

        assertThat(existingText.getContent()).isEqualTo("New Content");
        assertThat(existingText.getPositionX()).isEqualTo(20.0);

        verify(edgeService).syncEdges(eq(10L), eq(request.edges()), anyMap());
    }

    @Test
    void shouldCreateNewEntitiesAndResolveEdgesInBatch() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(new ArrayList<>());
        when(sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(10L)).thenReturn(List.of());
        when(textRepository.findAllByRoadmapIdOrderByIdAsc(10L)).thenReturn(List.of());

        when(nodeRepository.save(any(Node.class))).thenAnswer(invocation -> {
            Node node = invocation.getArgument(0);
            node.setId(555L);
            return node;
        });

        SyncCanvasRequest request = new SyncCanvasRequest(
                List.of(new CanvasNodeSyncItem(-1L, "Fresh Node", NodeType.DEFAULT, "Details", true, 100.0, 100.0, null, null)),
                List.of(new CanvasSectionSyncItem(-1L, "Fresh Section", 10.0, 10.0, 300.0, 200.0, 0)),
                List.of(new CanvasTextSyncItem(-1L, "Fresh Text", 5.0, 5.0)),
                List.of(new RoadmapEdgeRequest(-1L, -1L, "bottom", "top")),
                null, null, null
        );

        when(sectionService.getSectionsByRoadmapId(10L)).thenReturn(List.of());
        when(nodeService.getNodesByRoadmapId(10L)).thenReturn(List.of());
        when(textService.getTextsByRoadmapId(10L)).thenReturn(List.of());
        when(edgeService.getEdgesByRoadmapId(10L)).thenReturn(List.of());

        RoadmapCanvasResponse response = canvasService.syncCanvas(10L, request);

        assertThat(response).isNotNull();
        verify(nodeRepository).save(any(Node.class));
        verify(sectionRepository).save(any(Section.class));
        verify(textRepository).save(any(RoadmapText.class));
        verify(edgeService).syncEdges(eq(10L), eq(request.edges()), anyMap());
    }

    @Test
    void shouldDeleteRequestedEntitiesInBatch() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node nodeToDelete = Node.builder().id(99L).roadmap(testRoadmap).title("Delete Me").build();
        Section sectionToDelete = Section.builder().id(88L).roadmap(testRoadmap).title("Delete Section").build();
        RoadmapText textToDelete = RoadmapText.builder().id(77L).roadmap(testRoadmap).content("Delete Text").build();

        when(nodeRepository.findById(99L)).thenReturn(Optional.of(nodeToDelete));
        when(sectionRepository.findById(88L)).thenReturn(Optional.of(sectionToDelete));
        when(textRepository.findById(77L)).thenReturn(Optional.of(textToDelete));

        SyncCanvasRequest request = new SyncCanvasRequest(
                List.of(), List.of(), List.of(), List.of(),
                List.of(99L), List.of(88L), List.of(77L)
        );

        when(sectionService.getSectionsByRoadmapId(10L)).thenReturn(List.of());
        when(nodeService.getNodesByRoadmapId(10L)).thenReturn(List.of());
        when(textService.getTextsByRoadmapId(10L)).thenReturn(List.of());
        when(edgeService.getEdgesByRoadmapId(10L)).thenReturn(List.of());

        canvasService.syncCanvas(10L, request);

        verify(nodeRepository).delete(nodeToDelete);
        verify(sectionRepository).delete(sectionToDelete);
        verify(textRepository).delete(textToDelete);
    }

    @Test
    void shouldThrowWhenDuplicateStartNodesInBatch() {
        when(roadmapService.findRoadmapOrThrow(10L)).thenReturn(testRoadmap);

        Node existingStart = Node.builder().id(1L).roadmap(testRoadmap).type(NodeType.START).title("Start 1").build();
        when(nodeRepository.findAllByRoadmapId(10L)).thenReturn(new ArrayList<>(List.of(existingStart)));

        when(nodeRepository.save(any(Node.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SyncCanvasRequest request = new SyncCanvasRequest(
                List.of(new CanvasNodeSyncItem(-1L, "Start 2", NodeType.START, null, true, 0.0, 0.0, null, null)),
                null, null, null
        );

        assertThatThrownBy(() -> canvasService.syncCanvas(10L, request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("START");
    }
}
