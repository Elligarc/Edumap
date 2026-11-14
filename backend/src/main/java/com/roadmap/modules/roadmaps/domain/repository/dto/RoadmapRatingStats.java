package com.roadmap.modules.roadmaps.domain.repository.dto;

public record RoadmapRatingStats(
        Long roadmapId,
        Double averageRating,
        long ratingsCount
) {
    public Double getRoundedAverage() {
        return (averageRating != null && ratingsCount > 0)
                ? Math.round(averageRating * 10.0) / 10.0
                : null;
    }
}
