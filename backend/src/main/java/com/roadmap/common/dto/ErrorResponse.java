package com.roadmap.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Map;

@Schema(description = "Стандартный формат ответа об ошибке")
public record ErrorResponse(
        @Schema(description = "Машиночитаемый код ошибки", example = "ROADMAP_NOT_FOUND")
        String code,

        @Schema(description = "Понятное человеку описание ошибки", example = "Дорожная карта с указанным ID не найдена")
        String detail,

        @Schema(description = "Детализация ошибок валидации по полям (при наличии)")
        Map<String, String> fieldErrors
) {
    public ErrorResponse(String code, String detail) {
        this(code, detail, null);
    }
}
