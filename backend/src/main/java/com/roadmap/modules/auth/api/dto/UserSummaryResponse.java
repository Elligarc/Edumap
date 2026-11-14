package com.roadmap.modules.auth.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Краткая информация о пользователе")
public record UserSummaryResponse(
        @Schema(description = "ID пользователя", example = "1")
        Long id,

        @Schema(description = "Имя пользователя", example = "Иван Иванов")
        String name,

        @Schema(description = "Email", example = "user@example.com")
        String email
) {
}
