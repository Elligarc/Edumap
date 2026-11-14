package com.roadmap.modules.progress.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Schema(description = "Детальный статус и прогресс по конкретной дорожной карте")
@Builder
public record RoadmapProgressDetailResponse(
        Long roadmapId,
        boolean isEnrolled,
        int totalNodes,
        int completedNodes,
        int progressPercent,
        List<Long> completedNodeIds
) {
}
