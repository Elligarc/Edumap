package com.roadmap.modules.progress.api;

import com.roadmap.common.exception.GlobalExceptionHandler;
import com.roadmap.modules.progress.api.dto.MyRoadmapsProgressResponse;
import com.roadmap.modules.progress.api.dto.ProgressRoadmapCardDto;
import com.roadmap.modules.progress.api.dto.RoadmapProgressDetailResponse;
import com.roadmap.modules.progress.application.ProgressService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProgressControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProgressService progressService;

    @InjectMocks
    private ProgressController progressController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(progressController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void getMyRoadmapsProgress_shouldReturnLists() throws Exception {
        ProgressRoadmapCardDto card = ProgressRoadmapCardDto.builder()
                .roadmapId(1L)
                .title("Test Roadmap")
                .progressPercent(40)
                .build();

        MyRoadmapsProgressResponse response = MyRoadmapsProgressResponse.builder()
                .inProgress(List.of(card))
                .completed(List.of())
                .build();

        when(progressService.getMyRoadmapsProgress()).thenReturn(response);

        mockMvc.perform(get("/api/v1/progress/my-roadmaps"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.inProgress[0].roadmapId").value(1))
                .andExpect(jsonPath("$.inProgress[0].title").value("Test Roadmap"))
                .andExpect(jsonPath("$.inProgress[0].progressPercent").value(40));
    }

    @Test
    void enroll_shouldReturnDetail() throws Exception {
        RoadmapProgressDetailResponse detail = RoadmapProgressDetailResponse.builder()
                .roadmapId(1L)
                .isEnrolled(true)
                .totalNodes(10)
                .completedNodes(0)
                .progressPercent(0)
                .completedNodeIds(List.of())
                .build();

        when(progressService.enroll(1L)).thenReturn(detail);

        mockMvc.perform(post("/api/v1/progress/roadmaps/1/enroll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roadmapId").value(1))
                .andExpect(jsonPath("$.isEnrolled").value(true));
    }

    @Test
    void toggleNodeProgress_shouldReturnUpdatedDetail() throws Exception {
        RoadmapProgressDetailResponse detail = RoadmapProgressDetailResponse.builder()
                .roadmapId(1L)
                .isEnrolled(true)
                .totalNodes(10)
                .completedNodes(1)
                .progressPercent(10)
                .completedNodeIds(List.of(5L))
                .build();

        when(progressService.toggleNodeProgress(1L, 5L)).thenReturn(detail);

        mockMvc.perform(post("/api/v1/progress/roadmaps/1/nodes/5/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completedNodes").value(1))
                .andExpect(jsonPath("$.progressPercent").value(10));
    }
}
