package com.roadmap.modules.progress.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.List;

@Schema(description = "Списки дорожных карт пользователя в процессе и завершённых")
@Builder
public record MyRoadmapsProgressResponse(
        List<ProgressRoadmapCardDto> inProgress,
        List<ProgressRoadmapCardDto> completed
) {
}
