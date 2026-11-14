package com.roadmap.modules.progress.api;

import com.roadmap.modules.progress.api.dto.MyRoadmapsProgressResponse;
import com.roadmap.modules.progress.api.dto.RoadmapProgressDetailResponse;
import com.roadmap.modules.progress.application.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Progress", description = "Управление прогрессом прохождения дорожных карт")
@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @Operation(summary = "Получить прогресс прохождения дорожных карт текущего пользователя")
    @GetMapping("/my-roadmaps")
    public ResponseEntity<MyRoadmapsProgressResponse> getMyRoadmapsProgress() {
        return ResponseEntity.ok(progressService.getMyRoadmapsProgress());
    }

    @Operation(summary = "Получить прогресс и статус прохождения конкретной дорожной карты")
    @GetMapping("/roadmaps/{roadmapId}")
    public ResponseEntity<RoadmapProgressDetailResponse> getRoadmapProgress(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(progressService.getRoadmapProgress(roadmapId));
    }

    @Operation(summary = "Записаться на прохождение дорожной карты")
    @PostMapping("/roadmaps/{roadmapId}/enroll")
    public ResponseEntity<RoadmapProgressDetailResponse> enroll(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(progressService.enroll(roadmapId));
    }

    @Operation(summary = "Отменить запись на прохождение дорожной карты")
    @DeleteMapping("/roadmaps/{roadmapId}/enroll")
    public ResponseEntity<RoadmapProgressDetailResponse> unenroll(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(progressService.unenroll(roadmapId));
    }

    @Operation(summary = "Переключить статус выполнения узла дорожной карты")
    @PostMapping("/roadmaps/{roadmapId}/nodes/{nodeId}/toggle")
    public ResponseEntity<RoadmapProgressDetailResponse> toggleNodeProgress(
            @PathVariable Long roadmapId,
            @PathVariable Long nodeId
    ) {
        return ResponseEntity.ok(progressService.toggleNodeProgress(roadmapId, nodeId));
    }
}
