package com.roadmap.modules.nodes.domain.exception;

import com.roadmap.common.exception.ResourceNotFoundException;

public class NodeNotFoundException extends ResourceNotFoundException {

    public NodeNotFoundException(Long id) {
        super("NODE_NOT_FOUND", "Узел с ID " + id + " не найден");
    }
}
