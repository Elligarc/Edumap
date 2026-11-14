package com.roadmap.modules.nodes.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapCanvasResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.SyncCanvasRequest;
import com.roadmap.modules.nodes.application.RoadmapCanvasService;
import com.roadmap.modules.nodes.domain.model.NodeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RoadmapCanvasControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoadmapCanvasService canvasService;

    @InjectMocks
    private RoadmapCanvasController canvasController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(canvasController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldGetCanvasByRoadmapId() throws Exception {
        SectionResponse section = new SectionResponse(
                1L, 10L, "Main Section", 100.0, 200.0, 400.0, 300.0, 0,
                Instant.now(), Instant.now()
        );
        NodeResponse node = new NodeResponse(
                101L, 10L, "Node 1", NodeType.START,
                "Content", true, null, 120.0, 220.0, List.of(),
                Instant.now(), Instant.now()
        );
        RoadmapTextResponse text = new RoadmapTextResponse(
                201L, 10L, "Note on canvas", 50.0, 60.0,
                Instant.now(), Instant.now()
        );

        RoadmapEdgeResponse edge = new RoadmapEdgeResponse(
                301L, 101L, 102L, "bottom", "top"
        );

        RoadmapCanvasResponse canvasResponse = new RoadmapCanvasResponse(
                10L, "Frontend Track", List.of(section), List.of(node), List.of(text), List.of(edge)
        );

        when(canvasService.getCanvasByRoadmapId(10L)).thenReturn(canvasResponse);

        mockMvc.perform(get("/api/v1/roadmaps/10/canvas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadmapId").value(10L))
                .andExpect(jsonPath("$.title").value("Frontend Track"))
                .andExpect(jsonPath("$.sections[0].title").value("Main Section"))
                .andExpect(jsonPath("$.nodes[0].title").value("Node 1"))
                .andExpect(jsonPath("$.texts[0].content").value("Note on canvas"))
                .andExpect(jsonPath("$.edges[0].id").value(301L))
                .andExpect(jsonPath("$.edges[0].sourceHandle").value("bottom"))
                .andExpect(jsonPath("$.edges[0].targetHandle").value("top"));
    }

    @Test
    void shouldSyncCanvasEndpoint() throws Exception {
        RoadmapCanvasResponse canvasResponse = new RoadmapCanvasResponse(
                10L, "Frontend Track", List.of(), List.of(), List.of(), List.of()
        );

        when(canvasService.syncCanvas(eq(10L), any(SyncCanvasRequest.class))).thenReturn(canvasResponse);

        String jsonPayload = """
                {
                    "nodes": [
                        { "id": 101, "title": "Node 1", "positionX": 150.0, "positionY": 250.0 }
                    ],
                    "sections": [
                        { "id": 1, "title": "Section 1", "positionX": 50.0, "positionY": 60.0, "width": 400.0, "height": 300.0 }
                    ],
                    "texts": [
                        { "id": 201, "content": "Canvas Note", "positionX": 10.0, "positionY": 20.0 }
                    ],
                    "edges": [
                        { "sourceNodeId": 101, "targetNodeId": 102, "sourceHandle": "bottom", "targetHandle": "top" }
                    ]
                }
                """;

        mockMvc.perform(put("/api/v1/roadmaps/10/canvas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadmapId").value(10L))
                .andExpect(jsonPath("$.title").value("Frontend Track"));
    }
}
