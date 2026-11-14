package com.roadmap.modules.roadmaps.domain.exception;

import com.roadmap.common.exception.ResourceNotFoundException;

public class RoadmapNotFoundException extends ResourceNotFoundException {

    public RoadmapNotFoundException(Long id) {
        super("ROADMAP_NOT_FOUND", "Дорожная карта с ID " + id + " не найдена");
    }
}
