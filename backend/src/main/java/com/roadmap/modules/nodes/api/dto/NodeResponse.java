package com.roadmap.modules.nodes.api.dto;

import com.roadmap.modules.nodes.domain.model.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.List;

@Schema(description = "Ответ с данными узла дорожной карты")
public record NodeResponse(
        @Schema(description = "ID узла", example = "1")
        Long id,

        @Schema(description = "ID дорожной карты, которой принадлежит узел", example = "10")
        Long roadmapId,

        @Schema(description = "Название узла", example = "Основы HTML и CSS")
        String title,

        @Schema(description = "Тип узла (DEFAULT, START, END)", example = "START")
        NodeType type,

        @Schema(description = "Содержимое/описание узла (Markdown)")
        String content,

        @Schema(description = "Обязателен ли узел для прохождения", example = "true")
        boolean isRequired,

        @Schema(description = "ID родительского узла", example = "2")
        Long parentNodeId,

        @Schema(description = "Позиция X на холсте", example = "120.0")
        Double positionX,

        @Schema(description = "Позиция Y на холсте", example = "240.0")
        Double positionY,

        @Schema(description = "Список учебных ресурсов узла (ссылки на YouTube, статьи, документацию)")
        List<NodeResourceResponse> resources,

        @Schema(description = "Дата создания")
        Instant createdAt,

        @Schema(description = "Дата последнего обновления")
        Instant updatedAt
) {
    public NodeResponse(Long id, Long roadmapId, String title, NodeType type, String content, boolean isRequired, Long parentNodeId, List<NodeResourceResponse> resources, Instant createdAt, Instant updatedAt) {
        this(id, roadmapId, title, type, content, isRequired, parentNodeId, 0.0, 0.0, resources, createdAt, updatedAt);
    }
}
