package com.roadmap.modules.auth.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ при успешной аутентификации")
public record AuthResponse(
        @Schema(description = "Данные пользователя")
        UserSummaryResponse user,

        @Schema(description = "Access токен (JWT)")
        String accessToken
) {
}
