package com.roadmap.modules.comments.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Статистика оценок и оценка текущего пользователя")
public record RoadmapRatingResponse(
        @Schema(description = "ID дорожной карты", example = "1")
        Long roadmapId,

        @Schema(description = "Средняя оценка (округленная до 1 знака)", example = "4.8")
        Double averageRating,

        @Schema(description = "Общее количество оценок", example = "12")
        long ratingsCount,

        @Schema(description = "Оценка текущего пользователя (если выставлена)", example = "5")
        Integer currentUserRating
) {
}
