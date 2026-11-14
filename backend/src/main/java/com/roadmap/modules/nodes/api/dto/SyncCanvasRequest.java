package com.roadmap.modules.nodes.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

import java.util.List;

@Schema(description = "Запрос на пакетную синхронизацию элементов холста (узлы, секции, тексты, связи)")
public record SyncCanvasRequest(
        @Schema(description = "Список обновляемых узлов (новые узлы передаются с id <= 0)")
        List<@Valid CanvasNodeSyncItem> nodes,

        @Schema(description = "Список обновляемых секций (новые секции передаются с id <= 0)")
        List<@Valid CanvasSectionSyncItem> sections,

        @Schema(description = "Список обновляемых текстовых блоков (новые заметки передаются с id <= 0)")
        List<@Valid CanvasTextSyncItem> texts,

        @Schema(description = "Список связей между узлами")
        List<@Valid RoadmapEdgeRequest> edges,

        @Schema(description = "Список ID удаляемых узлов")
        List<Long> deletedNodeIds,

        @Schema(description = "Список ID удаляемых секций")
        List<Long> deletedSectionIds,

        @Schema(description = "Список ID удаляемых текстовых блоков")
        List<Long> deletedTextIds
) {
    public SyncCanvasRequest(
            List<CanvasNodeSyncItem> nodes,
            List<CanvasSectionSyncItem> sections,
            List<CanvasTextSyncItem> texts,
            List<RoadmapEdgeRequest> edges
    ) {
        this(nodes, sections, texts, edges, null, null, null);
    }
}
