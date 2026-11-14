package com.roadmap.modules.nodes.application;

import com.roadmap.modules.nodes.api.dto.CanvasSectionSyncItem;
import com.roadmap.modules.nodes.api.dto.CreateSectionRequest;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.UpdateSectionRequest;
import com.roadmap.modules.nodes.application.mapper.SectionMapper;
import com.roadmap.modules.nodes.domain.exception.SectionNotFoundException;
import com.roadmap.modules.nodes.domain.model.Section;
import com.roadmap.modules.nodes.domain.repository.SectionRepository;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SectionService {

    private final SectionRepository sectionRepository;
    private final RoadmapService roadmapService;
    private final SectionMapper sectionMapper;

    public List<SectionResponse> getSectionsByRoadmapId(Long roadmapId) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        roadmapService.validateRoadmapAccess(roadmap);
        return sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(roadmapId).stream()
                .map(sectionMapper::toResponse)
                .toList();
    }

    @Transactional
    public SectionResponse createSection(Long roadmapId, CreateSectionRequest request) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        Section section = sectionMapper.toEntity(request, roadmap);
        Section saved = sectionRepository.save(section);
        log.info("Created section id={} in roadmap id={}", saved.getId(), roadmapId);
        return sectionMapper.toResponse(saved);
    }

    public SectionResponse getSectionById(Long sectionId) {
        Section section = findSectionOrThrow(sectionId);
        return sectionMapper.toResponse(section);
    }

    @Transactional
    public SectionResponse updateSection(Long sectionId, UpdateSectionRequest request) {
        Section section = findSectionOrThrow(sectionId);

        if (request.title() != null && !request.title().isBlank()) {
            section.setTitle(request.title().trim());
        }
        if (request.positionX() != null) {
            section.setPositionX(request.positionX());
        }
        if (request.positionY() != null) {
            section.setPositionY(request.positionY());
        }
        if (request.width() != null) {
            section.setWidth(request.width());
        }
        if (request.height() != null) {
            section.setHeight(request.height());
        }
        if (request.sortOrder() != null) {
            section.setSortOrder(request.sortOrder());
        }

        log.info("Updated section id={}", sectionId);
        return sectionMapper.toResponse(section);
    }

    @Transactional
    public void deleteSection(Long sectionId) {
        Section section = findSectionOrThrow(sectionId);
        sectionRepository.delete(section);
        log.info("Deleted section id={}", sectionId);
    }

    @Transactional
    public void syncSections(Roadmap roadmap, List<CanvasSectionSyncItem> sectionItems) {
        Long roadmapId = roadmap.getId();
        List<Section> roadmapSections = sectionRepository.findAllByRoadmapIdOrderBySortOrderAscIdAsc(roadmapId);
        Map<Long, Section> sectionMap = roadmapSections.stream()
                .collect(Collectors.toMap(Section::getId, Function.identity()));

        for (CanvasSectionSyncItem item : sectionItems) {
            if (item.id() <= 0) {
                Section section = Section.builder()
                        .roadmap(roadmap)
                        .title(item.title() != null && !item.title().isBlank() ? item.title().trim() : "Новая секция")
                        .positionX(item.positionX() != null ? item.positionX() : 0.0)
                        .positionY(item.positionY() != null ? item.positionY() : 0.0)
                        .width(item.width() != null ? item.width() : 380.0)
                        .height(item.height() != null ? item.height() : 260.0)
                        .sortOrder(item.sortOrder() != null ? item.sortOrder() : 0)
                        .build();
                sectionRepository.save(section);
                log.info("Created section in syncCanvas: title='{}', roadmapId={}", section.getTitle(), roadmapId);
            } else {
                Section section = sectionMap.get(item.id());
                if (section == null) {
                    throw new SectionNotFoundException(item.id());
                }
                if (item.title() != null && !item.title().isBlank()) {
                    section.setTitle(item.title().trim());
                }
                if (item.positionX() != null) {
                    section.setPositionX(item.positionX());
                }
                if (item.positionY() != null) {
                    section.setPositionY(item.positionY());
                }
                if (item.width() != null) {
                    section.setWidth(item.width());
                }
                if (item.height() != null) {
                    section.setHeight(item.height());
                }
                if (item.sortOrder() != null) {
                    section.setSortOrder(item.sortOrder());
                }
            }
        }
    }

    public Section findSectionOrThrow(Long sectionId) {
        return sectionRepository.findById(sectionId)
                .orElseThrow(() -> new SectionNotFoundException(sectionId));
    }
}
