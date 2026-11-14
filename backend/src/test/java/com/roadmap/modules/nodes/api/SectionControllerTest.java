package com.roadmap.modules.nodes.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.nodes.api.dto.CreateSectionRequest;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.UpdateSectionRequest;
import com.roadmap.modules.nodes.application.SectionService;
import com.roadmap.modules.nodes.domain.exception.SectionNotFoundException;
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
class SectionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SectionService sectionService;

    @InjectMocks
    private SectionController sectionController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sectionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void shouldGetSectionsByRoadmapId() throws Exception {
        SectionResponse section = new SectionResponse(
                1L, 10L, "Basics", 100.0, 200.0, 400.0, 300.0, 0,
                Instant.now(), Instant.now()
        );
        when(sectionService.getSectionsByRoadmapId(10L)).thenReturn(List.of(section));

        mockMvc.perform(get("/api/v1/roadmaps/10/sections"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Basics"))
                .andExpect(jsonPath("$[0].positionX").value(100.0))
                .andExpect(jsonPath("$[0].width").value(400.0));
    }

    @Test
    void shouldCreateSection() throws Exception {
        SectionResponse response = new SectionResponse(
                2L, 10L, "New Section", 50.0, 60.0, 350.0, 250.0, 1,
                Instant.now(), Instant.now()
        );
        when(sectionService.createSection(eq(10L), any(CreateSectionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/roadmaps/10/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "New Section",
                                  "positionX": 50.0,
                                  "positionY": 60.0,
                                  "width": 350.0,
                                  "height": 250.0,
                                  "sortOrder": 1
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.title").value("New Section"));
    }

    @Test
    void shouldRejectCreateSectionWithoutTitle() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps/10/sections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
    }

    @Test
    void shouldGetSectionById() throws Exception {
        SectionResponse section = new SectionResponse(
                1L, 10L, "Found Section", 0.0, 0.0, null, null, 0,
                Instant.now(), Instant.now()
        );
        when(sectionService.getSectionById(1L)).thenReturn(section);

        mockMvc.perform(get("/api/v1/sections/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Found Section"));
    }

    @Test
    void shouldReturn404WhenSectionNotFound() throws Exception {
        when(sectionService.getSectionById(999L)).thenThrow(new SectionNotFoundException(999L));

        mockMvc.perform(get("/api/v1/sections/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("SECTION_NOT_FOUND"));
    }

    @Test
    void shouldUpdateSection() throws Exception {
        SectionResponse response = new SectionResponse(
                1L, 10L, "Updated", 150.0, 250.0, null, null, 2,
                Instant.now(), Instant.now()
        );
        when(sectionService.updateSection(eq(1L), any(UpdateSectionRequest.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/sections/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated",
                                  "positionX": 150.0,
                                  "positionY": 250.0,
                                  "sortOrder": 2
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"))
                .andExpect(jsonPath("$.positionX").value(150.0));
    }

    @Test
    void shouldDeleteSection() throws Exception {
        doNothing().when(sectionService).deleteSection(1L);

        mockMvc.perform(delete("/api/v1/sections/1"))
                .andExpect(status().isNoContent());
    }
}
