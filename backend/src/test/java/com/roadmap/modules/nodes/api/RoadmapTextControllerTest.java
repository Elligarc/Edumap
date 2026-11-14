package com.roadmap.modules.nodes.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.nodes.api.dto.CreateTextRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.UpdateTextRequest;
import com.roadmap.modules.nodes.application.RoadmapTextService;
import com.roadmap.modules.nodes.domain.exception.RoadmapTextNotFoundException;
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
class RoadmapTextControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoadmapTextService textService;

    @InjectMocks
    private RoadmapTextController textController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(textController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldGetTextsByRoadmapId() throws Exception {
        RoadmapTextResponse text = new RoadmapTextResponse(
                1L, 10L, "Note 1", 20.0, 30.0, Instant.now(), Instant.now()
        );
        when(textService.getTextsByRoadmapId(10L)).thenReturn(List.of(text));

        mockMvc.perform(get("/api/v1/roadmaps/10/texts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].content").value("Note 1"))
                .andExpect(jsonPath("$[0].positionX").value(20.0));
    }

    @Test
    void shouldCreateText() throws Exception {
        RoadmapTextResponse response = new RoadmapTextResponse(
                2L, 10L, "New Note", 10.0, 15.0, Instant.now(), Instant.now()
        );
        when(textService.createText(eq(10L), any(CreateTextRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/roadmaps/10/texts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "New Note",
                                  "positionX": 10.0,
                                  "positionY": 15.0
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.content").value("New Note"));
    }

    @Test
    void shouldRejectCreateTextWithBlankContent() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps/10/texts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
    }

    @Test
    void shouldGetTextById() throws Exception {
        RoadmapTextResponse response = new RoadmapTextResponse(
                1L, 10L, "Sample text", 0.0, 0.0, Instant.now(), Instant.now()
        );
        when(textService.getTextById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/texts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.content").value("Sample text"));
    }

    @Test
    void shouldReturn404WhenTextNotFound() throws Exception {
        when(textService.getTextById(999L)).thenThrow(new RoadmapTextNotFoundException(999L));

        mockMvc.perform(get("/api/v1/texts/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("TEXT_NOT_FOUND"));
    }

    @Test
    void shouldUpdateText() throws Exception {
        RoadmapTextResponse response = new RoadmapTextResponse(
                1L, 10L, "Updated Note", 40.0, 50.0, Instant.now(), Instant.now()
        );
        when(textService.updateText(eq(1L), any(UpdateTextRequest.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/texts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "content": "Updated Note",
                                  "positionX": 40.0,
                                  "positionY": 50.0
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated Note"))
                .andExpect(jsonPath("$.positionX").value(40.0));
    }

    @Test
    void shouldDeleteText() throws Exception {
        doNothing().when(textService).deleteText(1L);

        mockMvc.perform(delete("/api/v1/texts/1"))
                .andExpect(status().isNoContent());
    }
}
