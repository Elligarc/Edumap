package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ с данными учебного ресурса узла")
public record NodeResourceResponse(
        @Schema(description = "ID ресурса", example = "1")
        Long id,

        @Schema(description = "Название ресурса", example = "Видеокурс по основам React на YouTube")
        String title,

        @Schema(description = "URL ссылки", example = "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        String url,

        @Schema(description = "Тип ресурса", example = "VIDEO")
        String type
) {
}
