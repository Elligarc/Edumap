package com.roadmap.modules.comments.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.comments.api.dto.RoadmapRatingResponse;
import com.roadmap.modules.comments.application.CommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CommentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CommentService commentService;

    @InjectMocks
    private CommentController commentController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(commentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/v1/roadmaps/{id}/rating с валидной оценкой возвращает 200 OK")
    void rateRoadmap_shouldReturnOk_whenValid() throws Exception {
        when(commentService.rateRoadmap(1L, 5))
                .thenReturn(new RoadmapRatingResponse(1L, 4.8, 10L, 5));

        mockMvc.perform(post("/api/v1/roadmaps/1/rating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 5}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadmapId").value(1L))
                .andExpect(jsonPath("$.averageRating").value(4.8))
                .andExpect(jsonPath("$.ratingsCount").value(10L))
                .andExpect(jsonPath("$.currentUserRating").value(5));
    }

    @Test
    @DisplayName("POST /api/v1/roadmaps/{id}/rating с оценкой > 5 возвращает 400 Bad Request")
    void rateRoadmap_shouldReturnBadRequest_whenRatingTooHigh() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps/1/rating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 6}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/v1/roadmaps/{id}/rating с оценкой < 1 возвращает 400 Bad Request")
    void rateRoadmap_shouldReturnBadRequest_whenRatingTooLow() throws Exception {
        mockMvc.perform(post("/api/v1/roadmaps/1/rating")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"rating\": 0}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/v1/roadmaps/{id}/rating возвращает статистику рейтинга")
    void getRoadmapRating_shouldReturnRatingStats() throws Exception {
        when(commentService.getRoadmapRating(1L))
                .thenReturn(new RoadmapRatingResponse(1L, 4.5, 3L, 4));

        mockMvc.perform(get("/api/v1/roadmaps/1/rating"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadmapId").value(1L))
                .andExpect(jsonPath("$.averageRating").value(4.5))
                .andExpect(jsonPath("$.ratingsCount").value(3L))
                .andExpect(jsonPath("$.currentUserRating").value(4));
    }
}
