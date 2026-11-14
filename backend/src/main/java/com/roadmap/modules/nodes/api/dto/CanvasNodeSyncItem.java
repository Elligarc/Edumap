package com.roadmap.modules.nodes.api.dto;

import com.roadmap.modules.nodes.domain.model.NodeType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Schema(description = "Элемент узла для пакетной синхронизации холста")
public record CanvasNodeSyncItem(
        @Schema(description = "ID узла", example = "10")
        @NotNull(message = "ID узла обязателен")
        Long id,

        @Schema(description = "Заголовок узла", example = "Основы Java")
        String title,

        @Schema(description = "Тип узла", example = "DEFAULT")
        NodeType type,

        @Schema(description = "Описание/содержимое")
        String content,

        @Schema(description = "Обязателен ли шаг", example = "true")
        Boolean isRequired,

        @Schema(description = "Координата X на холсте", example = "150.0")
        Double positionX,

        @Schema(description = "Координата Y на холсте", example = "200.0")
        Double positionY,

        @Schema(description = "ID родительского узла", example = "5")
        Long parentNodeId,

        @Schema(description = "Список учебных ресурсов узла")
        List<@Valid NodeResourceRequest> resources
) {
    public CanvasNodeSyncItem(
            Long id,
            String title,
            NodeType type,
            String content,
            Boolean isRequired,
            Double positionX,
            Double positionY,
            Long parentNodeId
    ) {
        this(id, title, type, content, isRequired, positionX, positionY, parentNodeId, null);
    }
}

