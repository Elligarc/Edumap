package com.roadmap.modules.nodes.api;

import com.roadmap.modules.nodes.api.dto.CreateTextRequest;
import com.roadmap.modules.nodes.api.dto.RoadmapTextResponse;
import com.roadmap.modules.nodes.api.dto.UpdateTextRequest;
import com.roadmap.modules.nodes.application.RoadmapTextService;
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

@Tag(name = "Texts", description = "Управление текстовыми блоками на холсте дорожной карты")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RoadmapTextController {

    private final RoadmapTextService textService;

    @Operation(summary = "Получить все текстовые блоки дорожной карты")
    @GetMapping("/roadmaps/{roadmapId}/texts")
    public ResponseEntity<List<RoadmapTextResponse>> getTextsByRoadmapId(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(textService.getTextsByRoadmapId(roadmapId));
    }

    @Operation(summary = "Создать новый текстовый блок на холсте")
    @PostMapping("/roadmaps/{roadmapId}/texts")
    public ResponseEntity<RoadmapTextResponse> createText(
            @PathVariable Long roadmapId,
            @Valid @RequestBody CreateTextRequest request
    ) {
        RoadmapTextResponse response = textService.createText(roadmapId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Получить текстовый блок по ID")
    @GetMapping("/texts/{textId}")
    public ResponseEntity<RoadmapTextResponse> getTextById(@PathVariable Long textId) {
        return ResponseEntity.ok(textService.getTextById(textId));
    }

    @Operation(summary = "Обновить текстовый блок")
    @PatchMapping("/texts/{textId}")
    public ResponseEntity<RoadmapTextResponse> updateText(
            @PathVariable Long textId,
            @Valid @RequestBody UpdateTextRequest request
    ) {
        return ResponseEntity.ok(textService.updateText(textId, request));
    }

    @Operation(summary = "Удалить текстовый блок")
    @DeleteMapping("/texts/{textId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteText(@PathVariable Long textId) {
        textService.deleteText(textId);
    }
}
