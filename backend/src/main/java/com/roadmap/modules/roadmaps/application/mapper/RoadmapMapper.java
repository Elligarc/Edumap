package com.roadmap.modules.roadmaps.application.mapper;

import com.roadmap.modules.roadmaps.api.dto.CreateRoadmapRequest;
import com.roadmap.modules.roadmaps.api.dto.RoadmapResponse;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.users.domain.model.User;
import org.springframework.stereotype.Component;

@Component
public class RoadmapMapper {

    public Roadmap toEntity(CreateRoadmapRequest request, User author) {
        return Roadmap.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .difficulty(request.difficulty())
                .price(request.price())
                .author(author)
                .visibility(request.visibility())
                .build();
    }

    public RoadmapResponse toResponse(Roadmap roadmap, long nodesCount) {
        return toResponse(roadmap, nodesCount, null, 0L, 0L);
    }

    public RoadmapResponse toResponse(
            Roadmap roadmap,
            long nodesCount,
            Double rating,
            long ratingsCount,
            long studentsCount
    ) {
        return toResponse(roadmap, nodesCount, rating, ratingsCount, studentsCount, null);
    }

    public RoadmapResponse toResponse(
            Roadmap roadmap,
            long nodesCount,
            Double rating,
            long ratingsCount,
            long studentsCount,
            Integer currentUserRating
    ) {
        Long authorId = roadmap.getAuthor() != null ? roadmap.getAuthor().getId() : null;
        String authorName = roadmap.getAuthor() != null ? roadmap.getAuthor().getName() : null;

        return new RoadmapResponse(
                roadmap.getId(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getCategory(),
                roadmap.getDifficulty(),
                roadmap.getPrice(),
                roadmap.getVisibility(),
                authorId,
                authorName,
                nodesCount,
                rating,
                ratingsCount,
                studentsCount,
                roadmap.getCreatedAt(),
                roadmap.getUpdatedAt(),
                currentUserRating
        );
    }
}
