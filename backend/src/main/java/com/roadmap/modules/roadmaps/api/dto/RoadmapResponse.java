package com.roadmap.modules.roadmaps.api.dto;

import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.Instant;

@Schema(description = "Ответ с данными дорожной карты")
public record RoadmapResponse(
        @Schema(description = "ID дорожной карты", example = "1")
        Long id,

        @Schema(description = "Название карты", example = "Frontend Developer 2026")
        String title,

        @Schema(description = "Описание карты", example = "Пошаговый план освоения современного веб-фронтенда")
        String description,

        @Schema(description = "Категория", example = "Разработка")
        String category,

        @Schema(description = "Уровень сложности", example = "BEGINNER")
        RoadmapDifficulty difficulty,

        @Schema(description = "Цена", example = "0.00")
        BigDecimal price,

        @Schema(description = "Видимость/статус", example = "PUBLISHED")
        RoadmapVisibility visibility,

        @Schema(description = "ID автора", example = "1")
        Long authorId,

        @Schema(description = "Имя автора", example = "demo_author")
        String authorName,

        @Schema(description = "Количество узлов в карте", example = "15")
        long nodesCount,

        @Schema(description = "Средняя оценка", example = "4.8")
        Double rating,

        @Schema(description = "Количество оценок", example = "24")
        long ratingsCount,

        @Schema(description = "Количество учащихся", example = "150")
        long studentsCount,

        @Schema(description = "Дата создания")
        Instant createdAt,

        @Schema(description = "Дата последнего обновления")
        Instant updatedAt,

        @Schema(description = "Оценка текущего пользователя (если выставлена)", example = "5")
        Integer currentUserRating
) {
}
