package com.roadmap.modules.roadmaps.domain.exception;

public class RoadmapAccessDeniedException extends RuntimeException {

    private final Long roadmapId;

    public RoadmapAccessDeniedException(Long roadmapId) {
        super(String.format("Доступ к приватной дорожной карте с ID %d ограничен", roadmapId));
        this.roadmapId = roadmapId;
    }

    public String getCode() {
        return "ROADMAP_ACCESS_DENIED";
    }

    public Long getRoadmapId() {
        return roadmapId;
    }
}
