package com.roadmap.modules.users.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Профиль пользователя")
public record UserProfileResponse(
        @Schema(description = "ID пользователя", example = "1")
        Long id,

        @Schema(description = "Имя пользователя", example = "Иван Иванов")
        String name,

        @Schema(description = "Электронная почта", example = "user@example.com")
        String email,

        @Schema(description = "Дата регистрации")
        Instant createdAt
) {
}
