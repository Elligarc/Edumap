package com.roadmap.modules.auth.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Ответ при обновлении токена")
public record TokenRefreshResponse(
        @Schema(description = "Access токен (JWT)")
        String accessToken
) {
}
