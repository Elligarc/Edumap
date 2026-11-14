package com.roadmap.modules.auth.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на регистрацию пользователя")
public record RegisterRequest(
        @Schema(description = "Имя пользователя", example = "Иван Иванов")
        @NotBlank(message = "Имя обязательно для заполнения")
        @Size(max = 50, message = "Имя не должно превышать 50 символов")
        String name,

        @Schema(description = "Электронная почта", example = "user@example.com")
        @NotBlank(message = "Email обязателен")
        @Email(message = "Некорректный формат email")
        @Size(max = 100, message = "Email не должен превышать 100 символов")
        String email,

        @Schema(description = "Пароль", example = "StrongPassword123")
        @NotBlank(message = "Пароль обязателен")
        @Size(min = 6, max = 100, message = "Пароль должен содержать от 6 до 100 символов")
        String password
) {
}
