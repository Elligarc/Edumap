package com.roadmap.modules.nodes.domain.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Тип узла в дорожной карте")
public enum NodeType {
    @Schema(description = "Стандартный узел темы/раздела")
    DEFAULT,

    @Schema(description = "Начальный узел (максимум один на дорожную карту)")
    START,

    @Schema(description = "Конечный/финальный узел (максимум один на дорожную карту)")
    END
}
