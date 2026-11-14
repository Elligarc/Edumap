package com.roadmap.modules.nodes.application.mapper;

import com.roadmap.modules.nodes.api.dto.CreateTextRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.springframework.stereotype.Component;

@Component
public class RoadmapTextMapper {

    public RoadmapText toEntity(CreateTextRequest request, Roadmap roadmap) {
        return RoadmapText.builder()
                .roadmap(roadmap)
                .content(request.content())
                .positionX(request.positionX() != null ? request.positionX() : 0.0)
                .positionY(request.positionY() != null ? request.positionY() : 0.0)
                .build();
    }

    public RoadmapTextResponse toResponse(RoadmapText text) {
        Long roadmapId = text.getRoadmap() != null ? text.getRoadmap().getId() : null;

        return new RoadmapTextResponse(
                text.getId(),
                roadmapId,
                text.getContent(),
                text.getPositionX(),
                text.getPositionY(),
                text.getCreatedAt(),
                text.getUpdatedAt()
        );
    }
}
