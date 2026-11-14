package com.roadmap.modules.users.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на смену пароля")
public record ChangePasswordRequest(
        @Schema(description = "Текущий пароль")
        @NotBlank(message = "Текущий пароль обязателен")
        String currentPassword,

        @Schema(description = "Новый пароль")
        @NotBlank(message = "Новый пароль обязателен")
        @Size(min = 6, max = 100, message = "Новый пароль должен содержать от 6 до 100 символов")
        String newPassword
) {
}
