package com.roadmap.modules.nodes.application.mapper;

import com.roadmap.modules.nodes.api.dto.CreateSectionRequest;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import org.springframework.stereotype.Component;

@Component
public class SectionMapper {

    public Section toEntity(CreateSectionRequest request, Roadmap roadmap) {
        return Section.builder()
                .roadmap(roadmap)
                .title(request.title())
                .positionX(request.positionX() != null ? request.positionX() : 0.0)
                .positionY(request.positionY() != null ? request.positionY() : 0.0)
                .width(request.width())
                .height(request.height())
                .sortOrder(request.sortOrder() != null ? request.sortOrder() : 0)
                .build();
    }

    public SectionResponse toResponse(Section section) {
        Long roadmapId = section.getRoadmap() != null ? section.getRoadmap().getId() : null;

        return new SectionResponse(
                section.getId(),
                roadmapId,
                section.getTitle(),
                section.getPositionX(),
                section.getPositionY(),
                section.getWidth(),
                section.getHeight(),
                section.getSortOrder(),
                section.getCreatedAt(),
                section.getUpdatedAt()
        );
    }
}
