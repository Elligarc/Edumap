package com.roadmap.modules.nodes.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.application.RoadmapEdgeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RoadmapEdgeControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private RoadmapEdgeService edgeService;

    @InjectMocks
    private RoadmapEdgeController edgeController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(edgeController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldGetEdgesByRoadmapId() throws Exception {
        RoadmapEdgeResponse response = new RoadmapEdgeResponse(1L, 10L, 20L, "bottom", "top");
        when(edgeService.getEdgesByRoadmapId(100L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/roadmaps/100/edges"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].sourceNodeId").value(10L))
                .andExpect(jsonPath("$[0].targetNodeId").value(20L))
                .andExpect(jsonPath("$[0].sourceHandle").value("bottom"))
                .andExpect(jsonPath("$[0].targetHandle").value("top"));
    }

    @Test
    void shouldSyncEdges() throws Exception {
        RoadmapEdgeRequest request = new RoadmapEdgeRequest(10L, 20L, "right", "left");
        RoadmapEdgeResponse response = new RoadmapEdgeResponse(1L, 10L, 20L, "right", "left");
        when(edgeService.syncEdges(eq(100L), any())).thenReturn(List.of(response));

        mockMvc.perform(put("/api/v1/roadmaps/100/edges")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(List.of(request))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].sourceHandle").value("right"))
                .andExpect(jsonPath("$[0].targetHandle").value("left"));
    }
}
