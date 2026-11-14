package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на создание секции дорожной карты")
public record CreateSectionRequest(
        @NotBlank(message = "Название секции обязательно")
        @Size(max = 150, message = "Название секции не может превышать 150 символов")
        @Schema(description = "Название секции", example = "Основы языка")
        String title,

        @Schema(description = "Позиция X на холсте", example = "100.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "200.0")
        Double positionY,

        @Schema(description = "Ширина секции на холсте", example = "400.0")
        Double width,

        @Schema(description = "Высота секции на холсте", example = "300.0")
        Double height,

        @Schema(description = "Порядок сортировки", example = "0")
        Integer sortOrder
) {
    public CreateSectionRequest {
        if (positionX == null) {
            positionX = 0.0;
        }
        if (positionY == null) {
            positionY = 0.0;
        }
        if (sortOrder == null) {
            sortOrder = 0;
        }
    }
}
