package com.roadmap.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "Стандартный пагинированный ответ")
public record PageResponse<T>(
        @Schema(description = "Список элементов страницы")
        List<T> items,

        @Schema(description = "Номер страницы (начиная с 0)", example = "0")
        int page,

        @Schema(description = "Размер страницы", example = "12")
        int size,

        @Schema(description = "Общее количество элементов", example = "42")
        long totalElements,

        @Schema(description = "Общее количество страниц", example = "4")
        int totalPages
) {
    public static <T> PageResponse<T> from(Page<T> springPage) {
        return new PageResponse<>(
                springPage.getContent(),
                springPage.getNumber(),
                springPage.getSize(),
                springPage.getTotalElements(),
                springPage.getTotalPages()
        );
    }
}
