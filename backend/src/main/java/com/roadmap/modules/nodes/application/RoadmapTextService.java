package com.roadmap.modules.nodes.application;

import com.roadmap.modules.nodes.api.dto.CanvasTextSyncItem;
import com.roadmap.modules.nodes.api.dto.CreateTextRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.UpdateTextRequest;
import com.roadmap.modules.nodes.application.mapper.RoadmapTextMapper;
import com.roadmap.modules.nodes.domain.exception.RoadmapTextNotFoundException;
import com.roadmap.modules.nodes.domain.model.RoadmapText;
import com.roadmap.modules.nodes.domain.repository.RoadmapTextRepository;
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
public class RoadmapTextService {

    private final RoadmapTextRepository textRepository;
    private final RoadmapService roadmapService;
    private final RoadmapTextMapper textMapper;

    public List<RoadmapTextResponse> getTextsByRoadmapId(Long roadmapId) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        roadmapService.validateRoadmapAccess(roadmap);
        return textRepository.findAllByRoadmapIdOrderByIdAsc(roadmapId).stream()
                .map(textMapper::toResponse)
                .toList();
    }

    @Transactional
    public RoadmapTextResponse createText(Long roadmapId, CreateTextRequest request) {
        Roadmap roadmap = roadmapService.findRoadmapOrThrow(roadmapId);
        RoadmapText text = textMapper.toEntity(request, roadmap);
        RoadmapText saved = textRepository.save(text);
        log.info("Created text id={} in roadmap id={}", saved.getId(), roadmapId);
        return textMapper.toResponse(saved);
    }

    public RoadmapTextResponse getTextById(Long textId) {
        RoadmapText text = findTextOrThrow(textId);
        return textMapper.toResponse(text);
    }

    @Transactional
    public RoadmapTextResponse updateText(Long textId, UpdateTextRequest request) {
        RoadmapText text = findTextOrThrow(textId);

        if (request.content() != null && !request.content().isBlank()) {
            text.setContent(request.content().trim());
        }
        if (request.positionX() != null) {
            text.setPositionX(request.positionX());
        }
        if (request.positionY() != null) {
            text.setPositionY(request.positionY());
        }

        log.info("Updated text id={}", textId);
        return textMapper.toResponse(text);
    }

    @Transactional
    public void deleteText(Long textId) {
        RoadmapText text = findTextOrThrow(textId);
        textRepository.delete(text);
        log.info("Deleted text id={}", textId);
    }

    @Transactional
    public void syncTexts(Roadmap roadmap, List<CanvasTextSyncItem> textItems) {
        Long roadmapId = roadmap.getId();
        List<RoadmapText> roadmapTexts = textRepository.findAllByRoadmapIdOrderByIdAsc(roadmapId);
        Map<Long, RoadmapText> textMap = roadmapTexts.stream()
                .collect(Collectors.toMap(RoadmapText::getId, Function.identity()));

        for (CanvasTextSyncItem item : textItems) {
            if (item.id() <= 0) {
                RoadmapText text = RoadmapText.builder()
                        .roadmap(roadmap)
                        .content(item.content() != null && !item.content().isBlank() ? item.content().trim() : "Текстовая заметка")
                        .positionX(item.positionX() != null ? item.positionX() : 0.0)
                        .positionY(item.positionY() != null ? item.positionY() : 0.0)
                        .build();
                textRepository.save(text);
                log.info("Created text in syncCanvas: roadmapId={}", roadmapId);
            } else {
                RoadmapText text = textMap.get(item.id());
                if (text == null) {
                    throw new RoadmapTextNotFoundException(item.id());
                }
                if (item.content() != null && !item.content().isBlank()) {
                    text.setContent(item.content().trim());
                }
                if (item.positionX() != null) {
                    text.setPositionX(item.positionX());
                }
                if (item.positionY() != null) {
                    text.setPositionY(item.positionY());
                }
            }
        }
    }

    public RoadmapText findTextOrThrow(Long textId) {
        return textRepository.findById(textId)
                .orElseThrow(() -> new RoadmapTextNotFoundException(textId));
    }
}
