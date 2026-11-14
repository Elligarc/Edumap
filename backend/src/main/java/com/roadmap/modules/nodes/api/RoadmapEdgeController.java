package com.roadmap.modules.nodes.api;

import com.roadmap.modules.nodes.api.dto.RoadmapEdgeRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapEdgeResponse;
import com.roadmap.modules.nodes.application.RoadmapEdgeService;
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

import java.util.List;

@Tag(name = "Roadmap Edges", description = "Управление связями (стрелками) на холсте дорожной карты")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RoadmapEdgeController {

    private final RoadmapEdgeService edgeService;

    @Operation(summary = "Получить все связи дорожной карты")
    @GetMapping("/roadmaps/{roadmapId}/edges")
    public ResponseEntity<List<RoadmapEdgeResponse>> getEdgesByRoadmapId(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(edgeService.getEdgesByRoadmapId(roadmapId));
    }

    @Operation(summary = "Синхронизировать связи дорожной карты (сохранение набора стрелок)")
    @PutMapping("/roadmaps/{roadmapId}/edges")
    public ResponseEntity<List<RoadmapEdgeResponse>> syncEdges(
            @PathVariable Long roadmapId,
            @RequestBody @Valid List<RoadmapEdgeRequest> requests
    ) {
        return ResponseEntity.ok(edgeService.syncEdges(roadmapId, requests));
    }
}
