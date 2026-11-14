package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Запрос на обновление текстового блока на холсте")
public record UpdateTextRequest(
        @Schema(description = "Текст/заметка", example = "Обновленное примечание")
        String content,

        @Schema(description = "Позиция X на холсте", example = "60.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "90.0")
        Double positionY
) {
}
