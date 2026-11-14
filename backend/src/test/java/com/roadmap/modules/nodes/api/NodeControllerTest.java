package com.roadmap.modules.nodes.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.nodes.api.dto.CreateNodeRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceResponse;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.UpdateNodeRequest;
import com.roadmap.modules.nodes.application.NodeService;
import com.roadmap.modules.nodes.domain.exception.NodeNotFoundException;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class NodeControllerTest {

    private MockMvc mockMvc;

    @Mock
    private NodeService nodeService;

    @InjectMocks
    private NodeController nodeController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(nodeController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldGetNodesByRoadmapId() throws Exception {
        NodeResponse node = new NodeResponse(
                101L, 10L, "HTML Basics", NodeType.START,
                "Learn semantic tags", true, null, List.of(),
                Instant.now(), Instant.now()
        );

        when(nodeService.getNodesByRoadmapId(10L)).thenReturn(List.of(node));

        mockMvc.perform(get("/api/v1/roadmaps/10/nodes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(101L))
                .andExpect(jsonPath("$[0].type").value("START"))
                .andExpect(jsonPath("$[0].title").value("HTML Basics"));
    }

    @Test
    void shouldCreateNode() throws Exception {
        NodeResponse node = new NodeResponse(
                101L, 10L, "HTML Basics", NodeType.DEFAULT,
                "Content", true, null, List.of(),
                Instant.now(), Instant.now()
        );

        when(nodeService.createNode(eq(10L), any(CreateNodeRequest.class))).thenReturn(node);

        mockMvc.perform(post("/api/v1/roadmaps/10/nodes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "HTML Basics",
                                  "type": "DEFAULT",
                                  "content": "Content",
                                  "isRequired": true
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(101L))
                .andExpect(jsonPath("$.type").value("DEFAULT"))
                .andExpect(jsonPath("$.title").value("HTML Basics"));
    }

    @Test
    void shouldReturnBadRequestWhenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps/10/nodes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.title").exists());
    }

    @Test
    void shouldGetNodeById() throws Exception {
        NodeResponse node = new NodeResponse(
                101L, 10L, "HTML Basics", NodeType.DEFAULT,
                "Content", true, null, List.of(),
                Instant.now(), Instant.now()
        );

        when(nodeService.getNodeById(101L)).thenReturn(node);

        mockMvc.perform(get("/api/v1/nodes/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(101L));
    }

    @Test
    void shouldReturnNotFoundWhenNodeDoesNotExist() throws Exception {
        when(nodeService.getNodeById(999L)).thenThrow(new NodeNotFoundException(999L));

        mockMvc.perform(get("/api/v1/nodes/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NODE_NOT_FOUND"));
    }

    @Test
    void shouldUpdateNode() throws Exception {
        NodeResponse node = new NodeResponse(
                101L, 10L, "Updated Title", NodeType.END,
                "Content", true, null, List.of(),
                Instant.now(), Instant.now()
        );

        when(nodeService.updateNode(eq(101L), any(UpdateNodeRequest.class))).thenReturn(node);

        mockMvc.perform(patch("/api/v1/nodes/101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated Title",
                                  "type": "END"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.type").value("END"));
    }

    @Test
    void shouldDeleteNode() throws Exception {
        doNothing().when(nodeService).deleteNode(101L);

        mockMvc.perform(delete("/api/v1/nodes/101"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldAddResourceToNode() throws Exception {
        NodeResourceResponse res = new NodeResourceResponse(
                55L, "MDN Docs", "https://developer.mozilla.org", "ARTICLE"
        );
        when(nodeService.addResource(eq(101L), any(NodeResourceRequest.class))).thenReturn(res);

        mockMvc.perform(post("/api/v1/nodes/101/resources")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "MDN Docs",
                                  "url": "https://developer.mozilla.org",
                                  "type": "ARTICLE"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(55L))
                .andExpect(jsonPath("$.title").value("MDN Docs"))
                .andExpect(jsonPath("$.url").value("https://developer.mozilla.org"));
    }

    @Test
    void shouldDeleteResourceFromNode() throws Exception {
        doNothing().when(nodeService).deleteResource(101L, 55L);

        mockMvc.perform(delete("/api/v1/nodes/101/resources/55"))
                .andExpect(status().isNoContent());
    }
}
