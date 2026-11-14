package com.roadmap.modules.nodes.domain.exception;

import com.roadmap.common.exception.ResourceNotFoundException;

public class RoadmapTextNotFoundException extends ResourceNotFoundException {

    public RoadmapTextNotFoundException(Long textId) {
        super("TEXT_NOT_FOUND", "Текстовый блок с ID " + textId + " не найден");
    }
}
