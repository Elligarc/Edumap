package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Запрос на создание текстового блока на холсте")
public record CreateTextRequest(
        @NotBlank(message = "Содержимое текстового блока обязательно")
        @Schema(description = "Текст/заметка", example = "Рекомендуется изучить перед практикой")
        String content,

        @Schema(description = "Позиция X на холсте", example = "50.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "80.0")
        Double positionY
) {
    public CreateTextRequest {
        if (positionX == null) {
            positionX = 0.0;
        }
        if (positionY == null) {
            positionY = 0.0;
        }
    }
}
