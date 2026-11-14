package com.roadmap.modules.nodes.api.dto;

import com.roadmap.modules.nodes.domain.model.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "Запрос на обновление узла дорожной карты")
public record UpdateNodeRequest(
        @Size(max = 150, message = "Название узла не может превышать 150 символов")
        @Schema(description = "Новое название узла", example = "Основы HTML5 и CSS3")
        String title,

        @Schema(description = "Новый тип узла (DEFAULT, START, END)", example = "END")
        NodeType type,

        @Schema(description = "Новое содержимое/описание узла (Markdown)", example = "Обновлённая программа раздела")
        String content,

        @Schema(description = "Обязателен ли узел для прохождения", example = "false")
        Boolean isRequired,

        @Schema(description = "ID родительского узла", example = "2")
        Long parentNodeId,

        @Schema(description = "Новая позиция X на холсте", example = "130.0")
        Double positionX,

        @Schema(description = "Новая позиция Y на холсте", example = "250.0")
        Double positionY,

        @Schema(description = "Список учебных ресурсов (заменяет список ресурсов узла при передаче)")
        List<@Valid NodeResourceRequest> resources
) {
    public UpdateNodeRequest(String title, NodeType type, String content, Boolean isRequired, Long parentNodeId, List<@Valid NodeResourceRequest> resources) {
        this(title, type, content, isRequired, parentNodeId, null, null, resources);
    }
}
