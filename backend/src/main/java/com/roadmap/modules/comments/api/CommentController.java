package com.roadmap.modules.comments.api;

import com.roadmap.modules.comments.api.dto.RoadmapRatingResponse;
import com.roadmap.modules.comments.api.dto.SetRoadmapRatingRequest;
import com.roadmap.modules.comments.application.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Comments & Ratings", description = "Управление комментариями и оценками дорожных карт")
@RestController
@RequestMapping("/api/v1/roadmaps")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "Оценить дорожную карту (числовая оценка 1–5)")
    @PostMapping("/{roadmapId}/rating")
    public ResponseEntity<RoadmapRatingResponse> rateRoadmap(
            @PathVariable Long roadmapId,
            @Valid @RequestBody SetRoadmapRatingRequest request
    ) {
        RoadmapRatingResponse response = commentService.rateRoadmap(roadmapId, request.rating());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Получить рейтинг дорожной карты и оценку текущего пользователя")
    @GetMapping("/{roadmapId}/rating")
    public ResponseEntity<RoadmapRatingResponse> getRoadmapRating(
            @PathVariable Long roadmapId
    ) {
        RoadmapRatingResponse response = commentService.getRoadmapRating(roadmapId);
        return ResponseEntity.ok(response);
    }
}
