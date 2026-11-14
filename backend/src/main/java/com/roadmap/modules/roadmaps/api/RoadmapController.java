package com.roadmap.modules.roadmaps.api;

import com.roadmap.common.dto.PageResponse;
import com.roadmap.modules.roadmaps.api.dto.CreateRoadmapRequest;
import com.roadmap.modules.roadmaps.api.dto.RoadmapResponse;
import com.roadmap.modules.roadmaps.api.dto.UpdateRoadmapRequest;
import com.roadmap.modules.roadmaps.application.RoadmapService;
import com.roadmap.modules.roadmaps.domain.model.RoadmapDifficulty;
import com.roadmap.modules.roadmaps.domain.model.RoadmapVisibility;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Roadmaps", description = "Управление дорожными картами")
@RestController
@RequestMapping("/api/v1/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @Operation(summary = "Создать новую дорожную карту")
    @PostMapping
    public ResponseEntity<RoadmapResponse> createRoadmap(@Valid @RequestBody CreateRoadmapRequest request) {
        RoadmapResponse response = roadmapService.createRoadmap(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Получить список дорожных карт текущего пользователя")
    @GetMapping("/my")
    public ResponseEntity<java.util.List<RoadmapResponse>> getMyRoadmaps() {
        return ResponseEntity.ok(roadmapService.getMyRoadmaps());
    }

    @Operation(summary = "Получить дорожную карту по ID")
    @GetMapping("/{roadmapId}")
    public ResponseEntity<RoadmapResponse> getRoadmapById(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(roadmapService.getRoadmapById(roadmapId));
    }

    @Operation(summary = "Получить каталог дорожных карт с фильтрацией и пагинацией")
    @GetMapping
    public ResponseEntity<PageResponse<RoadmapResponse>> getRoadmaps(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) RoadmapDifficulty difficulty,
            @RequestParam(required = false) RoadmapVisibility visibility,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(roadmapService.getRoadmaps(search, category, difficulty, visibility, pageable));
    }

    @Operation(summary = "Обновить метаданные дорожной карты")
    @PatchMapping("/{roadmapId}")
    public ResponseEntity<RoadmapResponse> updateRoadmap(
            @PathVariable Long roadmapId,
            @Valid @RequestBody UpdateRoadmapRequest request
    ) {
        return ResponseEntity.ok(roadmapService.updateRoadmap(roadmapId, request));
    }

    @Operation(summary = "Удалить дорожную карту")
    @DeleteMapping("/{roadmapId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoadmap(@PathVariable Long roadmapId) {
        roadmapService.deleteRoadmap(roadmapId);
    }

    @Operation(summary = "Опубликовать дорожную карту")
    @PostMapping("/{roadmapId}/publish")
    public ResponseEntity<RoadmapResponse> publishRoadmap(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(roadmapService.publishRoadmap(roadmapId));
    }

    @Operation(summary = "Скрыть дорожную карту")
    @PostMapping("/{roadmapId}/hide")
    public ResponseEntity<RoadmapResponse> hideRoadmap(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(roadmapService.hideRoadmap(roadmapId));
    }
}
