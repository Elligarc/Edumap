package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на добавление/обновление ресурса узла")
public record NodeResourceRequest(
        @NotBlank(message = "Название ресурса обязательно")
        @Size(max = 200, message = "Название ресурса не может превышать 200 символов")
        @Schema(description = "Название ресурса / статьи / видео", example = "Видеокурс по основам React на YouTube")
        String title,

        @NotBlank(message = "URL ресурса обязателен")
        @Schema(description = "Ссылка на ресурс", example = "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        String url,

        @Size(max = 50, message = "Тип ресурса не может превышать 50 символов")
        @Schema(description = "Тип ресурса (VIDEO, ARTICLE, WEBSITE, DOCS)", example = "VIDEO")
        String type
) {
    public NodeResourceRequest {
        if (type == null || type.isBlank()) {
            type = "WEBSITE";
        }
    }
}
