package com.roadmap.modules.users.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Schema(description = "Запрос на обновление профиля пользователя")
public record UpdateProfileRequest(
        @Schema(description = "Новое имя пользователя", example = "Иван Иванов")
        @Size(min = 1, max = 50, message = "Имя должно содержать от 1 до 50 символов")
        String name,

        @Schema(description = "Новая электронная почта", example = "new-email@example.com")
        @Email(message = "Некорректный формат email")
        @Size(max = 100, message = "Email не должен превышать 100 символов")
        String email
) {
}
