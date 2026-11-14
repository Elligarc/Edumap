package com.roadmap.modules.roadmaps.api.dto;

import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Schema(description = "Запрос на обновление дорожной карты")
public record UpdateRoadmapRequest(
        @Size(max = 200, message = "Название не может превышать 200 символов")
        @Schema(description = "Новое название дорожной карты", example = "Frontend Developer 2026 (Updated)")
        String title,

        @Schema(description = "Новое описание карты", example = "Обновлённое описание")
        String description,

        @Size(max = 100, message = "Категория не может превышать 100 символов")
        @Schema(description = "Новая категория карты", example = "Веб-разработка")
        String category,

        @Schema(description = "Сложность", example = "INTERMEDIATE")
        RoadmapDifficulty difficulty,

        @PositiveOrZero(message = "Цена не может быть отрицательной")
        @Digits(integer = 8, fraction = 0, message = "Цена должна быть целым числом")
        @Schema(description = "Цена карты", example = "4900")
        BigDecimal price,

        @Schema(description = "Видимость", example = "PUBLISHED")
        RoadmapVisibility visibility
) {
    public UpdateRoadmapRequest {
        if (price != null && price.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) == 0) {
            price = price.setScale(0, RoundingMode.UNNECESSARY);
        }
    }
}
