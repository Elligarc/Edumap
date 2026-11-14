package com.roadmap.modules.progress.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Schema(description = "Карточка прогресса дорожной карты")
@Builder
public record ProgressRoadmapCardDto(
        Long roadmapId,
        String title,
        String description,
        String category,
        String difficulty,
        int nodesCount,
        int completedNodesCount,
        int progressPercent,
        double rating,
        int participantsCount,
        boolean isCompleted
) {
}
