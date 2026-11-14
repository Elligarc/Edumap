package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Запрос на сохранение связи между узлами")
public record RoadmapEdgeRequest(
        @Schema(description = "ID исходного узла", example = "10")
        @NotNull(message = "ID исходного узла обязателен")
        Long sourceNodeId,

        @Schema(description = "ID целевого узла", example = "11")
        @NotNull(message = "ID целевого узла обязателен")
        Long targetNodeId,

        @Schema(description = "Точка выхода", example = "bottom")
        String sourceHandle,

        @Schema(description = "Точка входа", example = "top")
        String targetHandle
) {
}
