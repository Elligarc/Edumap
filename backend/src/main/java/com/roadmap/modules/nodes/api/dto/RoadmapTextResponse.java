package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Ответ с данными текстового блока на холсте")
public record RoadmapTextResponse(
        @Schema(description = "ID текстового блока", example = "1")
        Long id,

        @Schema(description = "ID дорожной карты", example = "10")
        Long roadmapId,

        @Schema(description = "Текст/содержимое блока", example = "Рекомендуется изучить перед практикой")
        String content,

        @Schema(description = "Позиция X на холсте", example = "50.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "80.0")
        Double positionY,

        @Schema(description = "Дата создания")
        Instant createdAt,

        @Schema(description = "Дата последнего обновления")
        Instant updatedAt
) {
}
