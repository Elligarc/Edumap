package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Связь (стрелка) между узлами на холсте дорожной карты")
public record RoadmapEdgeResponse(
        @Schema(description = "ID связи", example = "1")
        Long id,

        @Schema(description = "ID исходного узла (откуда выходит стрелка)", example = "10")
        Long sourceNodeId,

        @Schema(description = "ID целевого узла (куда входит стрелка)", example = "11")
        Long targetNodeId,

        @Schema(description = "Точка/сторона выхода (например bottom, right, top, left)", example = "bottom")
        String sourceHandle,

        @Schema(description = "Точка/сторона входа (например top, left, bottom, right)", example = "top")
        String targetHandle
) {
}
