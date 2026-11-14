package com.roadmap.modules.nodes.api.dto;

import com.roadmap.modules.nodes.domain.model.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "Запрос на создание узла дорожной карты")
public record CreateNodeRequest(
        @NotBlank(message = "Название узла обязательно")
        @Size(max = 150, message = "Название узла не может превышать 150 символов")
        @Schema(description = "Название узла", example = "Основы HTML и CSS")
        String title,

        @Schema(description = "Тип узла (DEFAULT, START, END)", example = "START")
        NodeType type,

        @Schema(description = "Содержимое/описание узла (Markdown)", example = "## Что изучить\n- Семантические теги\n- Селекторы CSS")
        String content,

        @Schema(description = "Обязателен ли узел для прохождения", example = "true")
        Boolean isRequired,

        @Schema(description = "ID родительского узла (при наличии)", example = "1")
        Long parentNodeId,

        @Schema(description = "Позиция X на холсте", example = "120.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "240.0")
        Double positionY,

        @Schema(description = "Список учебных ресурсов (ссылки на YouTube, статьи, документацию)")
        List<@Valid NodeResourceRequest> resources
) {
    public CreateNodeRequest {
        if (type == null) {
            type = NodeType.DEFAULT;
        }
        if (isRequired == null) {
            isRequired = true;
        }
        if (positionX == null) {
            positionX = 0.0;
        }
        if (positionY == null) {
            positionY = 0.0;
        }
    }

    public CreateNodeRequest(String title, NodeType type, String content, Boolean isRequired, Long parentNodeId, List<@Valid NodeResourceRequest> resources) {
        this(title, type, content, isRequired, parentNodeId, 0.0, 0.0, resources);
    }
}
