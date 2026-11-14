package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Полные данные холста дорожной карты (узлы, секции, текстовые блоки)")
public record RoadmapCanvasResponse(
        @Schema(description = "ID дорожной карты", example = "10")
        Long roadmapId,

        @Schema(description = "Название дорожной карты", example = "Frontend Developer")
        String title,

        @Schema(description = "Список секций на холсте")
        List<SectionResponse> sections,

        @Schema(description = "Список узлов дорожной карты")
        List<NodeResponse> nodes,

        @Schema(description = "Список текстовых блоков на холсте")
        List<RoadmapTextResponse> texts,

        @Schema(description = "Список связей (стрелок) между узлами на холсте")
        List<RoadmapEdgeResponse> edges
) {
}
