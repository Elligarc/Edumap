package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Ответ с данными секции дорожной карты")
public record SectionResponse(
        @Schema(description = "ID секции", example = "1")
        Long id,

        @Schema(description = "ID дорожной карты", example = "10")
        Long roadmapId,

        @Schema(description = "Название секции", example = "Основы языка")
        String title,

        @Schema(description = "Позиция X на холсте", example = "100.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "200.0")
        Double positionY,

        @Schema(description = "Ширина секции", example = "400.0")
        Double width,

        @Schema(description = "Высота секции", example = "300.0")
        Double height,

        @Schema(description = "Порядок сортировки", example = "0")
        Integer sortOrder,

        @Schema(description = "Дата создания")
        Instant createdAt,

        @Schema(description = "Дата последнего обновления")
        Instant updatedAt
) {
}
