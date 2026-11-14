package com.roadmap.modules.auth.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Запрос на вход в систему")
public record LoginRequest(
        @Schema(description = "Электронная почта", example = "user@example.com")
        @NotBlank(message = "Email обязателен")
        @Email(message = "Некорректный формат email")
        String email,

        @Schema(description = "Пароль", example = "StrongPassword123")
        @NotBlank(message = "Пароль обязателен")
        String password
) {
}
