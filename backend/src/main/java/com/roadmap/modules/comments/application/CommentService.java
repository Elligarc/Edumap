package com.roadmap.modules.comments.application;

import com.roadmap.common.security.CurrentUserProvider;
import com.roadmap.modules.comments.api.dto.RoadmapRatingResponse;
import com.roadmap.modules.comments.domain.model.Comment;
import com.roadmap.modules.comments.domain.repository.CommentRepository;
import com.roadmap.modules.roadmaps.domain.model.Roadmap;
import com.roadmap.modules.roadmaps.domain.repository.RoadmapRepository;
import com.roadmap.modules.roadmaps.domain.repository.dto.RoadmapRatingStats;
import com.roadmap.modules.roadmaps.domain.exception.RoadmapNotFoundException;
import com.roadmap.modules.users.domain.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final RoadmapRepository roadmapRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public RoadmapRatingResponse rateRoadmap(Long roadmapId, Integer rating) {
        Roadmap roadmap = roadmapRepository.findById(roadmapId)
                .orElseThrow(() -> new RoadmapNotFoundException(roadmapId));

        User user = currentUserProvider.getCurrentUser();

        Comment comment = commentRepository.findByRoadmapIdAndAuthorId(roadmapId, user.getId())
                .orElseGet(() -> Comment.builder()
                        .roadmap(roadmap)
                        .author(user)
                        .build());

        comment.setRating(rating);
        commentRepository.save(comment);

        log.info("User id={} rated roadmap id={} with score={}", user.getId(), roadmapId, rating);

        return buildRatingResponse(roadmapId, rating);
    }

    @Transactional(readOnly = true)
    public RoadmapRatingResponse getRoadmapRating(Long roadmapId) {
        if (!roadmapRepository.existsById(roadmapId)) {
            throw new RoadmapNotFoundException(roadmapId);
        }

        Integer currentUserRating = currentUserProvider.getCurrentUserOptional()
                .flatMap(user -> commentRepository.findByRoadmapIdAndAuthorId(roadmapId, user.getId()))
                .map(Comment::getRating)
                .orElse(null);

        return buildRatingResponse(roadmapId, currentUserRating);
    }

    private RoadmapRatingResponse buildRatingResponse(Long roadmapId, Integer currentUserRating) {
        RoadmapRatingStats stats = commentRepository.findRatingStatsByRoadmapIds(List.of(roadmapId))
                .stream()
                .findFirst()
                .orElse(null);

        Double averageRating = stats != null ? stats.getRoundedAverage() : null;
        long count = stats != null ? stats.ratingsCount() : 0L;

        return new RoadmapRatingResponse(roadmapId, averageRating, count, currentUserRating);
    }
}
