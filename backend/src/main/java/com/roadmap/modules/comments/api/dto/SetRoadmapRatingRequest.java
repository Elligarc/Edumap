package com.roadmap.modules.comments.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запрос на выставление оценки дорожной карте")
public record SetRoadmapRatingRequest(
        @Schema(description = "Оценка от 1 до 5", example = "5")
        @NotNull(message = "Оценка обязательна")
        @Min(value = 1, message = "Оценка не может быть меньше 1")
        @Max(value = 5, message = "Оценка не может быть больше 5")
        Integer rating
) {
}
