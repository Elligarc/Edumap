package com.roadmap.modules.roadmaps.api.dto;

import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Schema(description = "Запрос на создание дорожной карты")
public record CreateRoadmapRequest(
        @NotBlank(message = "Название дорожной карты обязательно")
        @Size(max = 200, message = "Название не может превышать 200 символов")
        @Schema(description = "Название дорожной карты", example = "Frontend Developer 2026")
        String title,

        @Schema(description = "Подробное описание карты", example = "Пошаговый план освоения современного веб-фронтенда")
        String description,

        @Size(max = 100, message = "Категория не может превышать 100 символов")
        @Schema(description = "Категория карты", example = "Разработка")
        String category,

        @Schema(description = "Сложность", example = "BEGINNER")
        RoadmapDifficulty difficulty,

        @PositiveOrZero(message = "Цена не может быть отрицательной")
        @Digits(integer = 8, fraction = 0, message = "Цена должна быть целым числом")
        @Schema(description = "Цена курса/карты", example = "0")
        BigDecimal price,

        @Schema(description = "Видимость", example = "PRIVATE")
        RoadmapVisibility visibility
) {
    public CreateRoadmapRequest {
        if (difficulty == null) {
            difficulty = RoadmapDifficulty.BEGINNER;
        }
        if (price == null) {
            price = BigDecimal.ZERO;
        } else if (price.remainder(BigDecimal.ONE).compareTo(BigDecimal.ZERO) == 0) {
            price = price.setScale(0, RoundingMode.UNNECESSARY);
        }
        visibility = RoadmapVisibility.PRIVATE;
    }
}
