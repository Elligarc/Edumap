package com.roadmap.modules.nodes.api;

import com.roadmap.modules.nodes.api.dto.CreateSectionRequest;
import com.roadmap.modules.nodes.api.dto.SectionResponse;
import com.roadmap.modules.nodes.api.dto.UpdateSectionRequest;
import com.roadmap.modules.nodes.application.SectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Sections", description = "Управление секциями на холсте дорожной карты")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @Operation(summary = "Получить все секции дорожной карты")
    @GetMapping("/roadmaps/{roadmapId}/sections")
    public ResponseEntity<List<SectionResponse>> getSectionsByRoadmapId(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(sectionService.getSectionsByRoadmapId(roadmapId));
    }

    @Operation(summary = "Создать новую секцию в дорожной карте")
    @PostMapping("/roadmaps/{roadmapId}/sections")
    public ResponseEntity<SectionResponse> createSection(
            @PathVariable Long roadmapId,
            @Valid @RequestBody CreateSectionRequest request
    ) {
        SectionResponse response = sectionService.createSection(roadmapId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Получить секцию по ID")
    @GetMapping("/sections/{sectionId}")
    public ResponseEntity<SectionResponse> getSectionById(@PathVariable Long sectionId) {
        return ResponseEntity.ok(sectionService.getSectionById(sectionId));
    }

    @Operation(summary = "Обновить секцию")
    @PatchMapping("/sections/{sectionId}")
    public ResponseEntity<SectionResponse> updateSection(
            @PathVariable Long sectionId,
            @Valid @RequestBody UpdateSectionRequest request
    ) {
        return ResponseEntity.ok(sectionService.updateSection(sectionId, request));
    }

    @Operation(summary = "Удалить секцию с холста (узлы сохраняются)")
    @DeleteMapping("/sections/{sectionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSection(@PathVariable Long sectionId) {
        sectionService.deleteSection(sectionId);
    }
}
