package com.roadmap.modules.nodes.api;

import com.roadmap.modules.nodes.api.dto.CreateNodeRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceRequest;
import com.roadmap.modules.nodes.api.dto.NodeResourceResponse;
import com.roadmap.modules.nodes.api.dto.NodeResponse;
import com.roadmap.modules.nodes.api.dto.UpdateNodeRequest;
import com.roadmap.modules.nodes.application.NodeService;
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

@Tag(name = "Nodes", description = "Управление узлами дорожных карт")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class NodeController {

    private final NodeService nodeService;

    @Operation(summary = "Получить все узлы дорожной карты")
    @GetMapping("/roadmaps/{roadmapId}/nodes")
    public ResponseEntity<List<NodeResponse>> getNodesByRoadmapId(@PathVariable Long roadmapId) {
        return ResponseEntity.ok(nodeService.getNodesByRoadmapId(roadmapId));
    }

    @Operation(summary = "Создать новый узел в дорожной карте")
    @PostMapping("/roadmaps/{roadmapId}/nodes")
    public ResponseEntity<NodeResponse> createNode(
            @PathVariable Long roadmapId,
            @Valid @RequestBody CreateNodeRequest request
    ) {
        NodeResponse response = nodeService.createNode(roadmapId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Получить узел по ID")
    @GetMapping("/nodes/{nodeId}")
    public ResponseEntity<NodeResponse> getNodeById(@PathVariable Long nodeId) {
        return ResponseEntity.ok(nodeService.getNodeById(nodeId));
    }

    @Operation(summary = "Обновить узел дорожной карты")
    @PatchMapping("/nodes/{nodeId}")
    public ResponseEntity<NodeResponse> updateNode(
            @PathVariable Long nodeId,
            @Valid @RequestBody UpdateNodeRequest request
    ) {
        return ResponseEntity.ok(nodeService.updateNode(nodeId, request));
    }

    @Operation(summary = "Удалить узел дорожной карты")
    @DeleteMapping("/nodes/{nodeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNode(@PathVariable Long nodeId) {
        nodeService.deleteNode(nodeId);
    }

    @Operation(summary = "Добавить учебный ресурс к узлу")
    @PostMapping("/nodes/{nodeId}/resources")
    public ResponseEntity<NodeResourceResponse> addResource(
            @PathVariable Long nodeId,
            @Valid @RequestBody NodeResourceRequest request
    ) {
        NodeResourceResponse response = nodeService.addResource(nodeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Удалить учебный ресурс узла")
    @DeleteMapping("/nodes/{nodeId}/resources/{resourceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteResource(
            @PathVariable Long nodeId,
            @PathVariable Long resourceId
    ) {
        nodeService.deleteResource(nodeId, resourceId);
    }
}
