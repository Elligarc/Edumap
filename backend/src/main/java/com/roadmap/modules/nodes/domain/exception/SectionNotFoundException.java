package com.roadmap.modules.nodes.domain.exception;

import com.roadmap.common.exception.ResourceNotFoundException;

public class SectionNotFoundException extends ResourceNotFoundException {

    public SectionNotFoundException(Long sectionId) {
        super("SECTION_NOT_FOUND", "Секция с ID " + sectionId + " не найдена");
    }
}
