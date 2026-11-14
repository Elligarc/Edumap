package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на обновление секции дорожной карты")
public record UpdateSectionRequest(
        @Size(max = 150, message = "Название секции не может превышать 150 символов")
        @Schema(description = "Название секции", example = "Продвинутые концепции")
        String title,

        @Schema(description = "Позиция X на холсте", example = "150.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "250.0")
        Double positionY,

        @Schema(description = "Ширина секции на холсте", example = "500.0")
        Double width,

        @Schema(description = "Высота секции на холсте", example = "400.0")
        Double height,

        @Schema(description = "Порядок сортировки", example = "1")
        Integer sortOrder
) {
}
