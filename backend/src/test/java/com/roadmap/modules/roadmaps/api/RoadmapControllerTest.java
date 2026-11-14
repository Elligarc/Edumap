package com.roadmap.modules.roadmaps.api;

import com.roadmap.common.dto.PageResponse;
import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.roadmaps.api.dto.CreateRoadmapRequest;
import com.roadmap.modules.roadmaps.api.dto.RoadmapResponse;
import com.roadmap.modules.roadmaps.api.dto.UpdateRoadmapRequest;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
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
class RoadmapControllerTest {

    private MockMvc mockMvc;

    @Mock
    private RoadmapService roadmapService;

    @InjectMocks
    private RoadmapController roadmapController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(roadmapController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();
    }

    @Test
    void shouldCreateRoadmap() throws Exception {
        RoadmapResponse response = new RoadmapResponse(
                1L, "React Guide", "Learn React", "Frontend",
                RoadmapDifficulty.BEGINNER, BigDecimal.ZERO,
                RoadmapVisibility.PRIVATE, 10L, "alice", 0L,
                null, 0L, 0L,
                Instant.now(), Instant.now(), null
        );

        when(roadmapService.createRoadmap(any(CreateRoadmapRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "React Guide",
                                  "description": "Learn React",
                                  "category": "Frontend"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("React Guide"))
                .andExpect(jsonPath("$.authorName").value("alice"));
    }

    @Test
    void shouldReturnBadRequestWhenTitleIsBlank() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps")
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
    void shouldReturnBadRequestWhenPriceHasFractions() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Roadmap with fraction price",
                                  "price": 49.99
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fieldErrors.price").exists());
    }

    @Test
    void shouldGetRoadmapById() throws Exception {
        RoadmapResponse response = new RoadmapResponse(
                1L, "React Guide", "Learn React", "Frontend",
                RoadmapDifficulty.BEGINNER, BigDecimal.ZERO,
                RoadmapVisibility.PUBLISHED, 10L, "alice", 3L,
                4.8, 12L, 150L,
                Instant.now(), Instant.now(), 5
        );

        when(roadmapService.getRoadmapById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/roadmaps/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nodesCount").value(3L))
                .andExpect(jsonPath("$.rating").value(4.8))
                .andExpect(jsonPath("$.ratingsCount").value(12L))
                .andExpect(jsonPath("$.studentsCount").value(150L))
                .andExpect(jsonPath("$.currentUserRating").value(5));
    }

    @Test
    void shouldGetMyRoadmaps() throws Exception {
        RoadmapResponse response = new RoadmapResponse(
                1L, "My Roadmap", "Description", "Frontend",
                RoadmapDifficulty.BEGINNER, BigDecimal.ZERO,
                RoadmapVisibility.PRIVATE, 10L, "alice", 5L,
                null, 0L, 0L,
                Instant.now(), Instant.now(), null
        );

        when(roadmapService.getMyRoadmaps()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/roadmaps/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("My Roadmap"));
    }

    @Test
    void shouldReturnNotFoundWhenRoadmapDoesNotExist() throws Exception {
        when(roadmapService.getRoadmapById(999L)).thenThrow(new RoadmapNotFoundException(999L));

        mockMvc.perform(get("/api/v1/roadmaps/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("ROADMAP_NOT_FOUND"));
    }

    @Test
    void shouldGetRoadmapsList() throws Exception {
        RoadmapResponse item = new RoadmapResponse(
                1L, "React Guide", "Learn React", "Frontend",
                RoadmapDifficulty.BEGINNER, BigDecimal.ZERO,
                RoadmapVisibility.PUBLISHED, 10L, "alice", 3L,
                4.9, 20L, 250L,
                Instant.now(), Instant.now(), null
        );
        PageResponse<RoadmapResponse> pageResponse = new PageResponse<>(
                List.of(item), 0, 10, 1L, 1
        );

        when(roadmapService.getRoadmaps(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/roadmaps?category=Frontend&page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].id").value(1L))
                .andExpect(jsonPath("$.totalElements").value(1L));
    }

    @Test
    void shouldUpdateRoadmap() throws Exception {
        RoadmapResponse response = new RoadmapResponse(
                1L, "Updated Title", "Updated Desc", "Frontend",
                RoadmapDifficulty.INTERMEDIATE, new BigDecimal("10.00"),
                RoadmapVisibility.PUBLISHED, 10L, "alice", 3L,
                null, 0L, 0L,
                Instant.now(), Instant.now(), null
        );

        when(roadmapService.updateRoadmap(eq(1L), any(UpdateRoadmapRequest.class))).thenReturn(response);

        mockMvc.perform(patch("/api/v1/roadmaps/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Updated Title",
                                  "difficulty": "INTERMEDIATE"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void shouldDeleteRoadmap() throws Exception {
        doNothing().when(roadmapService).deleteRoadmap(1L);

        mockMvc.perform(delete("/api/v1/roadmaps/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldPublishRoadmap() throws Exception {
        RoadmapResponse response = new RoadmapResponse(
                1L, "React Guide", "Learn React", "Frontend",
                RoadmapDifficulty.BEGINNER, BigDecimal.ZERO,
                RoadmapVisibility.PUBLISHED, 10L, "alice", 3L,
                null, 0L, 0L,
                Instant.now(), Instant.now(), null
        );

        when(roadmapService.publishRoadmap(1L)).thenReturn(response);

        mockMvc.perform(post("/api/v1/roadmaps/1/publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.visibility").value("PUBLISHED"));
    }
}
