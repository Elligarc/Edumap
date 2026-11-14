package com.roadmap.modules.nodes.api;

import com.roadmap.modules.nodes.api.dto.RoadmapCanvasResponse;
import com.roadmap.modules.nodes.api.dto.SyncCanvasRequest;
import com.roadmap.modules.nodes.application.RoadmapCanvasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Canvas", description = "Получение и синхронизация агрегированных данных холста дорожной карты")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RoadmapCanvasController {

    private final RoadmapCanvasService canvasService;

    @Operation(summary = "Получить полные данные холста дорожной карты (секции, узлы, тексты, связи)")
    @GetMapping("/roadmaps/{roadmapId}/canvas")
    public ResponseEntity<RoadmapCanvasResponse> getCanvasByRoadmapId(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(canvasService.getCanvasByRoadmapId(roadmapId));
    }

    @Operation(summary = "Пакетная синхронизация элементов холста (узлы, секции, тексты, связи)")
    @PutMapping("/roadmaps/{roadmapId}/canvas")
    public ResponseEntity<RoadmapCanvasResponse> syncCanvas(
            @PathVariable Long roadmapId,
            @Valid @RequestBody SyncCanvasRequest request
    ) {
        return ResponseEntity.ok(canvasService.syncCanvas(roadmapId, request));
    }
}
