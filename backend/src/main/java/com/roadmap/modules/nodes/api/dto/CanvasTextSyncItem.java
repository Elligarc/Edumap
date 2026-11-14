package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Элемент текстового блока для пакетной синхронизации холста")
public record CanvasTextSyncItem(
        @Schema(description = "ID текстового блока", example = "20")
        @NotNull(message = "ID текста обязателен")
        Long id,

        @Schema(description = "Содержимое текстового блока", example = "Важные замечания к модулю")
        String content,

        @Schema(description = "Позиция X на холсте", example = "500.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "120.0")
        Double positionY
) {
}
